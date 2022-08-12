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
class TaxonomiesController extends Controller {

	/**
	 * Register the routes for the objects of the controller.
	 */
	public function register_routes() {

		// Initialize route.
		register_rest_route(
			$this->namespace,
			'/taxonomies/initialize',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'get_initial_items' ),
				'permission_callback' => array( $this, 'get_items_permissions_check' ),
				'args'                => array(
					'items' => array(
						'required'    => true,
						'type'        => 'array',
						'description' => __( 'Items', 'gumponents' ),
						'items'       => array(
							'type'              => 'integer',
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
			'/taxonomies/query',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'get_items' ),
				'permission_callback' => array( $this, 'get_items_permissions_check' ),
				'args'                => array(
					'search'     => array(
						'required'          => true,
						'type'              => 'string',
						'description'       => __( 'Search Term', 'gumponents' ),
						'sanitize_callback' => 'sanitize_text_field',
						'default'           => '',
					),
					'taxonomies' => array(
						'required'    => false,
						'type'        => 'array',
						'description' => __( 'Taxonomies', 'gumponents' ),
						'default'     => [],
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
	 * Initialize taxonomy items.
	 *
	 * @param array $params API params.
	 * @return WP_REST_Response
	 */
	public function get_initial_items( $params ) {
		$results = get_terms( array(
			'include'    => $params['items'],
			'orderby'    => 'include',
			'hide_empty' => false,
		) );

		if ( empty( $results ) || is_wp_error( $results ) ) {
			return rest_ensure_response( [] );
		}

		$result_terms = [];
		foreach ( $results as $result ) {
			$result_terms[] = array(
				'id'    => $result->term_id,
				'value' => $result,
				'label' => $result->name,
			);
		}

		return rest_ensure_response( $result_terms );
	}

	/**
	 * API: Get items query.
	 *
	 * @param WP_REST_Request $request API Request.
	 * @return WP_REST_Response
	 */
	public function get_items( $request ) {
		$params = $request->get_params();

		$filter = ! empty( $params['filter'] ) ? '_' . $params['filter'] : '';
		$args   = apply_filters(
			'gumponents_taxonomies_relationship_query' . $filter,
			array(
				'taxonomy'   => $params['taxonomies'],
				'name__like' => $params['search'],
				'hide_empty' => false,
			)
		);

		$results = get_terms( $args );

		if ( empty( $results ) || is_wp_error( $results ) ) {
			return rest_ensure_response( [] );
		}

		$result_terms = [];
		foreach ( $results as $result ) {
			$result_terms[] = array(
				'id'    => $result->term_id,
				'value' => $result,
				'label' => $result->name,
			);
		}

		return rest_ensure_response(
			apply_filters(
				'gumponents_relationship_results' . $filter,
				$result_terms,
				$params
			)
		);
	}

}
