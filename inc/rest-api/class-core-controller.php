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
class CoreController extends WP_REST_Controller {

	/**
	 * Namespace.
	 *
	 * @var string Namespace.
	 */
	protected $namespace = 'gumponents/core/v1';

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
			'/get_post_types',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_post_types' ),
				'permission_callback' => array( $this, 'permissions_callback' ),
			)
		);

	}

	/**
	 * Only logged in users can do this.
	 *
	 * @return bool
	 */
	public function permissions_callback() {
		return apply_filters( 'gumponents_core_rest_permission', is_user_logged_in() );
	}

	/**
	 * API: Get post types.
	 *
	 * @return \WP_REST_Response
	 */
	public function get_post_types() {
		$post_types         = get_post_types( [], 'objects' );
		$exclude_post_types = apply_filters( 'gumponents_exclude_post_types', [ 'attachment' ] );

		foreach ( $post_types as $key => $post_type ) {
			if ( in_array( $key, $exclude_post_types, true ) ) {
				unset( $post_types[ $key ] );
			}

			if ( $post_type->_builtin && ! $post_type->public ) {
				unset( $post_types[ $key ] );
			}
		}

		return rest_ensure_response( apply_filters( 'gumponents_post_types', $post_types ) );
	}

}
