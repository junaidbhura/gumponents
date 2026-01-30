<?php

declare( strict_types = 1 );

namespace Aysnc\WordPress\Gumponents\RestApi;

use WP_REST_Controller;
use WP_REST_Request;
use WP_REST_Response;

/**
 * Media REST API controller.
 */
class MediaController extends WP_REST_Controller {
	/**
	 * REST API namespace.
	 *
	 * @var string
	 */
	protected $namespace = 'gumponents/media/v1';

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->register_routes();
	}

	/**
	 * Register routes.
	 */
	public function register_routes(): void {
		register_rest_route(
			$this->namespace,
			'/get',
			[
				'methods'             => 'GET',
				'callback'            => [ $this, 'get_attachment' ],
				'permission_callback' => [ $this, 'get_items_permissions_check' ],
				'args'                => [
					'id' => [
						'required'    => true,
						'type'        => 'string',
						'description' => __( 'Attachment ID', 'gumponents' ),
						'items'       => [
							'sanitize_callback' => 'sanitize_text_field',
						],
						'default' => '',
					],
				],
			],
		);
	}

	/**
	 * Check permissions.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 */
	public function get_items_permissions_check( $request ): bool {
		/** @var bool $permission */
		$permission = apply_filters( 'gumponents_attachment_rest_permission', is_user_logged_in() );

		return $permission;
	}

	/**
	 * Get attachment.
	 *
	 * @param WP_REST_Request $request API request.
	 */
	public function get_attachment( WP_REST_Request $request ): WP_REST_Response {
		/** @var array{ id: string } $params */
		$params = $request->get_params();

		return rest_ensure_response( wp_prepare_attachment_for_js( (int) $params['id'] ) );
	}
}
