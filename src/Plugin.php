<?php

declare( strict_types = 1 );

namespace Aysnc\WordPress\Gumponents;

/**
 * Plugin bootstrap class.
 */
class Plugin {
	/**
	 * Bootstrap the plugin.
	 */
	public static function bootstrap(): void {
		add_action( 'enqueue_block_assets', [ __CLASS__, 'enqueue_editor_assets' ] );
		add_action( 'rest_api_init', [ __CLASS__, 'register_rest_endpoints' ] );
	}

	/**
	 * Enqueue editor assets.
	 */
	public static function enqueue_editor_assets(): void {
		if ( ! is_admin() ) {
			return;
		}

		$plugin_dir_path = dirname( __DIR__ );
		$plugin_file     = $plugin_dir_path . '/gumponents.php';
		$asset_file      = $plugin_dir_path . '/build/index.asset.php';

		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		/** @var array{ dependencies: string[], version: string } $asset */
		$asset = require $asset_file;

		wp_enqueue_script(
			'gumponents-blocks',
			plugins_url( 'build/index.js', $plugin_file ),
			$asset['dependencies'],
			$asset['version'],
			false,
		);

		wp_enqueue_style(
			'gumponents',
			plugins_url( 'build/index.css', $plugin_file ),
			[],
			$asset['version'],
		);
	}

	/**
	 * Register REST API endpoints.
	 */
	public static function register_rest_endpoints(): void {
		new RestApi\Relationship\PostsController();
		new RestApi\Relationship\TaxonomiesController();
		new RestApi\MediaController();
	}
}
