<?php
declare( strict_types = 1 );

namespace Aysnc\WordPress\Gumponents\Tests\RestApi\Relationship;

use Aysnc\WordPress\Gumponents\RestApi\Relationship\PostsController;
use WP_UnitTestCase;

/**
 * PostsController tests.
 */
class PostsControllerTest extends WP_UnitTestCase {

	/**
	 * Test that routes are registered.
	 */
	public function test_routes_registered(): void {
		new PostsController();

		$routes = rest_get_server()->get_routes();
		$this->assertArrayHasKey( '/gumponents/relationship/v1/posts/initialize', $routes );
		$this->assertArrayHasKey( '/gumponents/relationship/v1/posts/query', $routes );
	}

	/**
	 * Test permission callback filters.
	 */
	public function test_permission_filter(): void {
		$controller = new PostsController();

		add_filter( 'gumponents_relationship_rest_permission', '__return_false' );

		$request    = new \WP_REST_Request( 'POST', '/gumponents/relationship/v1/posts/query' );
		$permission = $controller->get_items_permissions_check( $request );

		$this->assertFalse( $permission );

		remove_filter( 'gumponents_relationship_rest_permission', '__return_false' );
	}
}
