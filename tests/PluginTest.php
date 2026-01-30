<?php
declare( strict_types = 1 );

namespace Aysnc\WordPress\Gumponents\Tests;

use Aysnc\WordPress\Gumponents\Plugin;
use WP_UnitTestCase;

/**
 * Plugin bootstrap tests.
 */
class PluginTest extends WP_UnitTestCase {

	/**
	 * Test that the plugin class exists.
	 */
	public function test_plugin_class_exists(): void {
		$this->assertTrue( class_exists( Plugin::class ) );
	}

	/**
	 * Test that bootstrap registers hooks.
	 */
	public function test_bootstrap_registers_hooks(): void {
		Plugin::bootstrap();

		$this->assertNotFalse( has_action( 'enqueue_block_assets', [ Plugin::class, 'enqueue_editor_assets' ] ) );
		$this->assertNotFalse( has_action( 'rest_api_init', [ Plugin::class, 'register_rest_endpoints' ] ) );
	}
}
