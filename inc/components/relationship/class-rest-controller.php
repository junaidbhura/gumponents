<?php
/**
 * Rest API Controller.
 *
 * @package JB\Gumponents\Components\Relationship
 */

namespace JB\Gumponents\Components\Relationship;

use WP_REST_Controller;

/**
 * Class Rest.
 */
class RestController extends WP_REST_Controller {

	/**
	 * Namespace.
	 *
	 * @var string Namespace.
	 */
	protected $namespace = 'gumponents/relationship/v1';

	/**
	 * Rest constructor.
	 */
	public function __construct() {
		$this->register_routes();
	}

	/**
	 * Only logged in users can do this.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @return bool
	 */
	public function get_items_permissions_check( $request ) {
		return apply_filters( 'gumponents_relationship_rest_permission', is_user_logged_in() );
	}

}
