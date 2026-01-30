<?php

declare( strict_types = 1 );

namespace Aysnc\WordPress\Gumponents\RestApi\Relationship;

use WP_REST_Controller;
use WP_REST_Request;

/**
 * Base relationship REST API controller.
 */
class Controller extends WP_REST_Controller {
	/**
	 * REST API namespace.
	 *
	 * @var string
	 */
	protected $namespace = 'gumponents/relationship/v1';

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->register_routes();
	}

	/**
	 * Check permissions.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 */
	public function get_items_permissions_check( $request ): bool {
		/** @var bool $permission */
		$permission = apply_filters( 'gumponents_relationship_rest_permission', is_user_logged_in() );

		return $permission;
	}
}
