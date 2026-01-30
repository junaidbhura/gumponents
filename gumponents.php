<?php
/**
 * Plugin Name: Gumponents
 * Description: Essential Gutenberg components for WordPress.
 * Version: 2.0.0
 * Text Domain: gumponents
 * Author: Aysnc
 * Author URI: https://aysnc.dev
 *
 * @package aysnc/gumponents
 */

declare( strict_types = 1 );

namespace Aysnc\WordPress\Gumponents;

// Composer autoloader.
if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
	require_once __DIR__ . '/vendor/autoload.php';
}

// Bootstrap the plugin.
add_action( 'plugins_loaded', [ Plugin::class, 'bootstrap' ] );
