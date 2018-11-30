<?php
/**
 * Posts Rest API Controller.
 *
 * @package JB\Gumponents\Components\Relationship
 */

namespace JB\Gumponents\Components\Relationship;

use WP_REST_Request;
use WP_REST_Response;
use WP_Query;

/**
 * Class Rest.
 */
class PostsRestController extends RestController {

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
				'methods'  => 'POST',
				'callback' => array( $this, 'get_initial_items' ),
				'args'     => array(
					'items'           => array(
						'required'    => true,
						'type'        => 'array',
						'description' => __( 'Items', 'gumponents' ),
						'items'       => array(
							'sanitize_callback' => 'sanitize_text_field',
						),
						'default'     => [],
					),
				),
			)
		);

		// Query route.
		register_rest_route(
			$this->namespace,
			'/posts/query',
			array(
				'methods'  => 'POST',
				'callback' => array( $this, 'get_items' ),
				'args'     => array(
					'search'     => array(
						'required'          => true,
						'type'              => 'string',
						'description'       => __( 'Search Term', 'gumponents' ),
						'sanitize_callback' => 'sanitize_text_field',
						'default'           => '',
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
					'filter'     => array(
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

		$results = new WP_Query(
			array(
				'post_type'      => array_values( get_post_types() ), // 'any' doesn't show all post types.
				'posts_per_page' => -1,
				'post__in'       => $params['items'],
				'no_found_rows'  => true,
				'orderby'        => 'post__in',
			)
		);

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
			'post_status'    => 'publish',
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
			'gumponents_relationship_query' . $filter,
			$args
		);

		add_filter( 'posts_where', array( $this, 'title_where_filter' ) );
		$results = new WP_Query( $args );
		remove_filter( 'posts_where', array( $this, 'title_where_filter' ) );

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
