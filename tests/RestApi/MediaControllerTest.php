<?php
declare( strict_types = 1 );

namespace Aysnc\WordPress\Gumponents\Tests\RestApi;

use Aysnc\WordPress\Gumponents\RestApi\MediaController;
use WP_UnitTestCase;

/**
 * MediaController tests.
 */
class MediaControllerTest extends WP_UnitTestCase {

	/**
	 * Test that the controller class exists.
	 */
	public function test_controller_class_exists(): void {
		$this->assertTrue( class_exists( MediaController::class ) );
	}

	/**
	 * Test that routes are registered.
	 */
	public function test_routes_registered(): void {
		new MediaController();

		$routes = rest_get_server()->get_routes();
		$this->assertArrayHasKey( '/gumponents/media/v1/get', $routes );
	}

	/**
	 * Test permission callback filters.
	 */
	public function test_permission_filter(): void {
		$controller = new MediaController();

		add_filter( 'gumponents_attachment_rest_permission', '__return_false' );

		$request    = new \WP_REST_Request( 'GET', '/gumponents/media/v1/get' );
		$permission = $controller->get_items_permissions_check( $request );

		$this->assertFalse( $permission );

		remove_filter( 'gumponents_attachment_rest_permission', '__return_false' );
	}
}
