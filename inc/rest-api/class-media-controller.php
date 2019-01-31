<?php
/**
 * Rest API Controller.
 *
 * @package gumponents
 */

namespace JB\Gumponents\RestApi;

use WP_REST_Controller;

/**
 * Class Rest.
 */
class MediaController extends WP_REST_Controller {

	/**
	 * Namespace.
	 *
	 * @var string Namespace.
	 */
	protected $namespace = 'gumponents/media/v1';

	/**
	 * Rest constructor.
	 */
	public function __construct() {
		$this->register_routes();
	}

	/**
	 * Register the routes for the objects of the controller.
	 */
	public function register_routes() {

		register_rest_route(
			$this->namespace,
			'/get',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_attachment' ),
				'permission_callback' => array( $this, 'get_items_permissions_check' ),
				'args'                => array(
					'id' => array(
						'required'    => true,
						'type'        => 'string',
						'description' => __( 'Attachment ID', 'gumponents' ),
						'items'       => array(
							'sanitize_callback' => 'sanitize_text_field',
						),
						'default'     => '',
					),
				),
			)
		);

	}

	/**
	 * Only logged in users can do this.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @return bool
	 */
	public function get_items_permissions_check( $request ) {
		return apply_filters( 'gumponents_attachment_rest_permission', is_user_logged_in() );
	}

	/**
	 * API: Get attachment.
	 *
	 * @param WP_REST_Request $request API Request.
	 * @return WP_REST_Response
	 */
	public function get_attachment( $request ) {
		$params = $request->get_params();
		return rest_ensure_response( wp_prepare_attachment_for_js( $params['id'] ) );
	}

}
