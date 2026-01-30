<?php
declare( strict_types = 1 );

namespace Aysnc\WordPress\Gumponents\Tests\RestApi\Relationship;

use Aysnc\WordPress\Gumponents\RestApi\Relationship\TaxonomiesController;
use WP_UnitTestCase;

/**
 * TaxonomiesController tests.
 */
class TaxonomiesControllerTest extends WP_UnitTestCase {

	/**
	 * Test that routes are registered.
	 */
	public function test_routes_registered(): void {
		new TaxonomiesController();

		$routes = rest_get_server()->get_routes();
		$this->assertArrayHasKey( '/gumponents/relationship/v1/taxonomies/initialize', $routes );
		$this->assertArrayHasKey( '/gumponents/relationship/v1/taxonomies/query', $routes );
	}

	/**
	 * Test permission callback filters.
	 */
	public function test_permission_filter(): void {
		$controller = new TaxonomiesController();

		add_filter( 'gumponents_relationship_rest_permission', '__return_false' );

		$request    = new \WP_REST_Request( 'POST', '/gumponents/relationship/v1/taxonomies/query' );
		$permission = $controller->get_items_permissions_check( $request );

		$this->assertFalse( $permission );

		remove_filter( 'gumponents_relationship_rest_permission', '__return_false' );
	}
}
