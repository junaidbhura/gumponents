<?php

declare( strict_types = 1 );

namespace Aysnc\WordPress\Gumponents\RestApi\Relationship;

use WP_REST_Request;
use WP_REST_Response;

/**
 * Taxonomies relationship REST API controller.
 */
class TaxonomiesController extends Controller {
	/**
	 * Register routes.
	 */
	public function register_routes(): void {
		register_rest_route(
			$this->namespace,
			'/taxonomies/initialize',
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
				],
			],
		);

		register_rest_route(
			$this->namespace,
			'/taxonomies/query',
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
					'taxonomies' => [
						'required'    => false,
						'type'        => 'array',
						'description' => __( 'Taxonomies', 'gumponents' ),
						'default'     => [],
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
	 * Get initial taxonomy items.
	 *
	 * @param WP_REST_Request $request API request.
	 */
	public function get_initial_items( WP_REST_Request $request ): WP_REST_Response {
		/** @var array{ items: int[] } $params */
		$params = $request->get_params();

		$results = get_terms(
			[
				'include'    => $params['items'],
				'orderby'    => 'include',
				'hide_empty' => false,
			],
		);

		if ( empty( $results ) || is_wp_error( $results ) ) {
			return rest_ensure_response( [] );
		}

		$result_terms = [];

		foreach ( $results as $result ) {
			$result_terms[] = [
				'id'    => $result->term_id,
				'value' => $result,
				'label' => $result->name,
			];
		}

		return rest_ensure_response( $result_terms );
	}

	/**
	 * Get items query.
	 *
	 * @param WP_REST_Request $request API request.
	 */
	public function get_items( $request ): WP_REST_Response {
		/** @var array{ search: string, taxonomies: string[], filter?: string } $params */
		$params = $request->get_params();

		$filter = ! empty( $params['filter'] ) ? '_' . $params['filter'] : '';

		/** @var array<string, mixed> $args */
		$args = apply_filters(
			'gumponents_taxonomies_relationship_query' . $filter,
			[
				'taxonomy'   => $params['taxonomies'],
				'name__like' => $params['search'],
				'hide_empty' => false,
			],
		);

		$results = get_terms( $args );

		if ( empty( $results ) || is_wp_error( $results ) ) {
			return rest_ensure_response( [] );
		}

		$result_terms = [];

		foreach ( $results as $result ) {
			$result_terms[] = [
				'id'    => $result->term_id,
				'value' => $result,
				'label' => $result->name,
			];
		}

		return rest_ensure_response(
			apply_filters(
				'gumponents_relationship_results' . $filter,
				$result_terms,
				$params,
			),
		);
	}
}
