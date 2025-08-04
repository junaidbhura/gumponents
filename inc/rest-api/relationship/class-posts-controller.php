<?php
/**
 * Posts Rest API Controller.
 *
 * @package gumponents
 */

namespace JB\Gumponents\RestApi\Relationship;

use WP_REST_Request;
use WP_REST_Response;
use WP_Query;

/**
 * Class Rest.
 */
class PostsController extends Controller {

	/**
	 * Store search term.
	 *
	 * @var string Search term.
	 */
	private $search = '';

	/**
	 * Register the routes for the objects of the controller.
	 */
	public function register_routes() {

		// Initialize route.
		register_rest_route(
			$this->namespace,
			'/posts/initialize',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'get_initial_items' ),
				'permission_callback' => array( $this, 'get_items_permissions_check' ),
				'args'                => array(
					'items'      => array(
						'required'    => true,
						'type'        => 'array',
						'description' => __( 'Items', 'gumponents' ),
						'items'       => array(
							'type'              => 'integer',
							'sanitize_callback' => 'sanitize_text_field',
						),
						'default'     => [],
					),
					'post_types' => array(
						'required'    => true,
						'type'        => 'array',
						'description' => __( 'Post Types', 'gumponents' ),
						'items'       => array(
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
						),
						'default'     => [ 'post' ],
					),
				),
			)
		);

		// Query route.
		register_rest_route(
			$this->namespace,
			'/posts/query',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'get_items' ),
				'permission_callback' => array( $this, 'get_items_permissions_check' ),
				'args'                => array(
					'search'          => array(
						'required'          => true,
						'type'              => 'string',
						'description'       => __( 'Search Term', 'gumponents' ),
						'sanitize_callback' => 'sanitize_text_field',
						'default'           => '',
					),
					'post_types'      => array(
						'required'    => true,
						'type'        => 'array',
						'description' => __( 'Post Types', 'gumponents' ),
						'items'       => array(
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
						),
						'default'     => [ 'post' ],
					),
					'post_taxonomies' => array(
						'required'    => false,
						'type'        => 'array',
						'description' => __( 'Post Taxonomies', 'gumponents' ),
						'default'     => [],
					),
					'post_status'     => array(
						'required'    => false,
						'type'        => 'object',
						'description' => __( 'Post Status', 'gumponents' ),
						'items'       => array(
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
						),
						'default'     => [ 'publish' ],
					),
					'filter'          => array(
						'required'          => false,
						'type'              => 'string',
						'description'       => __( 'Custom Filter', 'gumponents' ),
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
			)
		);

	}

	/**
	 * API: Initialize items.
	 *
	 * @param WP_REST_Request $request API Request.
	 * @return WP_REST_Response
	 */
	public function get_initial_items( $request ) {
		$params = $request->get_params();

		$args = array(
			'post_type'      => $params['post_types'],
			'posts_per_page' => -1,
			'post__in'       => $params['items'],
			'no_found_rows'  => true,
			'orderby'        => 'post__in',
		);

		$args = apply_filters(
			'gumponents_posts_relationship_initial_items_query',
			$args,
			$params
		);

		$results = new WP_Query( $args );

		if ( empty( $results->posts ) ) {
			return rest_ensure_response( [] );
		}

		$result_posts = [];
		foreach ( $results->posts as $result ) {
			$result_posts[] = array(
				'id'    => $result->ID,
				'value' => $result,
				'label' => $result->post_title,
			);
		}

		return rest_ensure_response( $result_posts );
	}

	/**
	 * API: Get items query.
	 *
	 * @param WP_REST_Request $request API Request.
	 * @return WP_REST_Response
	 */
	public function get_items( $request ) {
		$params = $request->get_params();

		$this->search = $params['search'];
		$filter       = ! empty( $params['filter'] ) ? '_' . $params['filter'] : '';

		$args = array(
			'post_status'    => $params['post_status'] ?? 'publish',
			'post_type'      => $params['post_types'],
			'posts_per_page' => 20,
			'no_found_rows'  => true,
		);

		if ( ! empty( $params['post_taxonomies'] ) ) {
			$args['tax_query'] = array(
				'relation' => 'OR',
			);
			foreach ( $params['post_taxonomies'] as $post_taxonomy ) {
				foreach ( $post_taxonomy as $taxonomy => $slugs ) {
					$args['tax_query'][] = array(
						'taxonomy' => $taxonomy,
						'field'    => 'slug',
						'terms'    => $slugs,
					);
				}
			}
		}

		$args = apply_filters(
			'gumponents_posts_relationship_query' . $filter,
			$args,
			$params
		);

		$search_title = apply_filters( 'gumponents_posts_relationship_query_search_title', true );

		if ( $search_title ) {
			add_filter( 'posts_where', array( $this, 'title_where_filter' ) );
		}
		$results = new WP_Query( $args );
		if ( $search_title ) {
			remove_filter( 'posts_where', array( $this, 'title_where_filter' ) );
		}

		if ( empty( $results->posts ) ) {
			return rest_ensure_response( [] );
		}

		$result_posts = [];
		foreach ( $results->posts as $result ) {
			$result_posts[] = array(
				'id'        => $result->ID,
				'value'     => $result,
				'label'     => 'draft' === $result->post_status ? sprintf( '%s %s', $result->post_title, '(Draft)' ) : $result->post_title,
				'permalink' => get_permalink( $result->ID ),
			);
		}

		/**
		 * Pre filters the posts relationship results before they are returned.
		 *
		 * @param array $result_posts Array of posts.
		 * @param array $params       Array of parameters used in the query.
		 */
		$result_posts = apply_filters(
			'gumponents_posts_relationship_pre_results',
			$result_posts,
			$params
		);

		return rest_ensure_response(
			apply_filters(
				'gumponents_posts_relationship_results' . $filter,
				$result_posts,
				$params
			)
		);
	}

	/**
	 * Update MySQL WHERE statement.
	 *
	 * @param string $where WHERE statement.
	 * @return string
	 */
	public function title_where_filter( $where = '' ) {
		global $wpdb;
		$where .= " AND {$wpdb->posts}.post_title LIKE '%" . esc_sql( $wpdb->esc_like( $this->search ) ) . "%'";
		return $where;
	}
}
