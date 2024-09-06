<?php
/**
 * Namespace functions.
 *
 * @package gumponents
 */

namespace JB\Gumponents;

use WP_Screen;

/**
 * Bootstrap the plugin.
 *
 * Registers actions and filters required to run the plugin.
 */
function setup() {
	// Add block assets.
	add_action( 'enqueue_block_assets', __NAMESPACE__ . '\\enqueue_editor_assets' );

	// Register REST endpoints.
	add_action( 'rest_api_init', __NAMESPACE__ . '\\register_rest_endpoints' );
}

/**
 * Register REST endpoints.
 */
function register_rest_endpoints() {
	new RestApi\Relationship\PostsController();
	new RestApi\Relationship\TaxonomiesController();
	new RestApi\MediaController();
}

/**
 * Enqueue block scripts.
 */
function enqueue_editor_assets() {
	/**
	 * Only enqueue assets in the admin.
	 */
	if ( ! is_admin() ) {
		return;
	}

	$plugin_dir_path  = dirname( __FILE__, 2 );
	$plugin_file_path = "{$plugin_dir_path}/gumponents.php";

	$deps = [
		'wp-i18n',
		'wp-blocks',
		'wp-components',
		'wp-plugins',
		'lodash',
	];

	$screen = get_current_screen();
	if ( $screen instanceof WP_Screen && 'widgets' !== $screen->base ) {
		$deps[] = 'wp-editor';
		$deps[] = 'wp-edit-post';
	}

	wp_enqueue_script( 'gumponents', plugins_url( 'assets/dist/blocks.js', $plugin_file_path ), $deps, GUMPONENTS_VERSION, false );
	wp_enqueue_style( 'gumponents', plugins_url( 'assets/dist/editor.css', $plugin_file_path ), [], GUMPONENTS_VERSION );
}
