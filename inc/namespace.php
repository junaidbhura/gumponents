<?php
/**
 * Namespace functions.
 *
 * @package JB\Gumponents
 */

namespace JB\Gumponents;

/**
 * Bootstrap the plugin.
 *
 * Registers actions and filters required to run the plugin.
 */
function setup() {
	// Add block assets.
	add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\\enqueue_editor_assets' );

	// Register REST endpoints.
	add_action( 'rest_api_init', __NAMESPACE__ . '\\register_rest_endpoints' );
}

/**
 * Register REST endpoints.
 */
function register_rest_endpoints() {
	new Components\Relationship\PostsRestController();
}

/**
 * Enqueue block scripts.
 */
function enqueue_editor_assets() {
	$plugin_dir_path  = dirname( __FILE__, 2 );
	$plugin_file_path = "{$plugin_dir_path}/gumponents.php";

	$deps = [
		'wp-i18n',
		'wp-blocks',
		'wp-components',
		'wp-editor',
		'wp-plugins',
		'wp-edit-post',
		'lodash',
	];

	wp_enqueue_script( 'gumponents', plugins_url( 'assets/dist/blocks.js', $plugin_file_path ), $deps, filemtime( "{$plugin_dir_path}/assets/dist/blocks.js" ), false );
	wp_enqueue_style( 'gumponents', plugins_url( 'assets/dist/editor.css', $plugin_file_path ), [], filemtime( "{$plugin_dir_path}/assets/dist/editor.css" ) );
}
