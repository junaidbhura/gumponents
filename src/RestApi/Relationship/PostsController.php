<?php

declare( strict_types = 1 );

namespace Aysnc\WordPress\Gumponents\RestApi\Relationship;

use WP_Post;
use WP_Query;
use WP_REST_Request;
use WP_REST_Response;

/**
 * Posts relationship REST API controller.
 */
class PostsController extends Controller {
	/**
	 * Search term.
	 *
	 * @var string
	 */
	private string $search = '';

	/**
	 * Register routes.
	 */
	public function register_routes(): void {
		register_rest_route(
			$this->namespace,
			'/posts/initialize',
			[
				'methods'             => 'POST',
				'callback'            => [ $this, 'get_initial_items' ],
				'permission_callback' => [ $this, 'get_items_permissions_check' ],
				'args'                => [
					'items' => [
						'required'    => true,
						'type'        => 'array',
						'description' => __( 'Items', 'gumponents' ),
						'items'       => [
							'type'              => 'integer',
							'sanitize_callback' => 'sanitize_text_field',
						],
						'default' => [],
					],
					'post_types' => [
						'required'    => true,
						'type'        => 'array',
						'description' => __( 'Post Types', 'gumponents' ),
						'items'       => [
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
						],
						'default' => [ 'post' ],
					],
				],
			],
		);

		register_rest_route(
			$this->namespace,
			'/posts/query',
			[
				'methods'             => 'POST',
				'callback'            => [ $this, 'get_items' ],
				'permission_callback' => [ $this, 'get_items_permissions_check' ],
				'args'                => [
					'search' => [
						'required'          => true,
						'type'              => 'string',
						'description'       => __( 'Search Term', 'gumponents' ),
						'sanitize_callback' => 'sanitize_text_field',
						'default'           => '',
					],
					'post_types' => [
						'required'    => true,
						'type'        => 'array',
						'description' => __( 'Post Types', 'gumponents' ),
						'items'       => [
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
						],
						'default' => [ 'post' ],
					],
					'post_taxonomies' => [
						'required'    => false,
						'type'        => 'array',
						'description' => __( 'Post Taxonomies', 'gumponents' ),
						'default'     => [],
					],
					'post_status' => [
						'required'    => false,
						'type'        => 'object',
						'description' => __( 'Post Status', 'gumponents' ),
						'items'       => [
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
						],
						'default' => [ 'publish' ],
					],
					'filter' => [
						'required'          => false,
						'type'              => 'string',
						'description'       => __( 'Custom Filter', 'gumponents' ),
						'sanitize_callback' => 'sanitize_text_field',
					],
				],
			],
		);
	}

	/**
	 * Get initial items.
	 *
	 * @param WP_REST_Request $request API request.
	 */
	public function get_initial_items( WP_REST_Request $request ): WP_REST_Response {
		/** @var array{ items: int[], post_types: string[] } $params */
		$params = $request->get_params();

		$args = [
			'post_type'      => $params['post_types'],
			'posts_per_page' => -1,
			'post__in'       => $params['items'],
			'no_found_rows'  => true,
			'orderby'        => 'post__in',
		];

		/** @var array<string, mixed> $args */
		$args = apply_filters(
			'gumponents_posts_relationship_initial_items_query',
			$args,
			$params,
		);

		$results = new WP_Query( $args );

		if ( empty( $results->posts ) ) {
			return rest_ensure_response( [] );
		}

		$result_posts = [];

		foreach ( $results->posts as $result ) {
			$result_posts[] = [
				'id'    => $result->ID,
				'value' => $result,
				'label' => $result->post_title,
			];
		}

		return rest_ensure_response( $result_posts );
	}

	/**
	 * Get items query.
	 *
	 * @param WP_REST_Request $request API request.
	 */
	public function get_items( $request ): WP_REST_Response {
		/** @var array{ search: string, filter?: string, post_status?: string|string[], post_types: string[], post_taxonomies?: array<int, array<string, string[]>> } $params */
		$params = $request->get_params();

		$this->search = $params['search'];
		$filter       = ! empty( $params['filter'] ) ? '_' . $params['filter'] : '';

		$args = [
			'post_status'    => $params['post_status'] ?? 'publish',
			'post_type'      => $params['post_types'],
			'posts_per_page' => 20,
			'no_found_rows'  => true,
		];

		if ( ! empty( $params['post_taxonomies'] ) ) {
			$args['tax_query'] = [
				'relation' => 'OR',
			];

			foreach ( $params['post_taxonomies'] as $post_taxonomy ) {
				foreach ( $post_taxonomy as $taxonomy => $slugs ) {
					$args['tax_query'][] = [
						'taxonomy' => $taxonomy,
						'field'    => 'slug',
						'terms'    => $slugs,
					];
				}
			}
		}

		/** @var array<string, mixed> $args */
		$args = apply_filters(
			'gumponents_posts_relationship_query' . $filter,
			$args,
			$params,
		);

		/** @var bool $search_title */
		$search_title = apply_filters( 'gumponents_posts_relationship_query_search_title', true );

		if ( $search_title ) {
			add_filter( 'posts_where', [ $this, 'title_where_filter' ] );
		}

		$results = new WP_Query( $args );

		if ( $search_title ) {
			remove_filter( 'posts_where', [ $this, 'title_where_filter' ] );
		}

		if ( empty( $results->posts ) ) {
			return rest_ensure_response( [] );
		}

		$result_posts = [];

		foreach ( $results->posts as $result ) {
			$result_posts[] = [
				'id'        => $result->ID,
				'value'     => $result,
				'label'     => 'draft' === $result->post_status ? sprintf( '%s %s', $result->post_title, '(Draft)' ) : $result->post_title,
				'permalink' => get_permalink( $result->ID ),
			];
		}

		/**
		 * Pre filters the posts relationship results before they are returned.
		 *
		 * @param array<int, array{ id: int, value: WP_Post, label: string, permalink: string|false }> $result_posts Array of posts.
		 * @param array<string, mixed>                                                                 $params       Array of parameters used in the query.
		 */
		$result_posts = apply_filters(
			'gumponents_posts_relationship_pre_results',
			$result_posts,
			$params,
		);

		return rest_ensure_response(
			apply_filters(
				'gumponents_posts_relationship_results' . $filter,
				$result_posts,
				$params,
			),
		);
	}

	/**
	 * Update MySQL WHERE statement for title search.
	 *
	 * @param string $where WHERE statement.
	 */
	public function title_where_filter( string $where = '' ): string {
		global $wpdb;

		$where .= " AND {$wpdb->posts}.post_title LIKE '%" . esc_sql( $wpdb->esc_like( $this->search ) ) . "%'";

		return $where;
	}
}
