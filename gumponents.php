<?php
/**
 * Plugin Name: Gumponents
 * Description: Essential Gutenberg components for WordPress.
 * Author: Junaid Bhura
 * Author URI: https://junaid.dev
 * Version: 0.7.2
 *
 * @package gumponents
 */

namespace JB\Gumponents;

define( 'GUMPONENTS_VERSION', '0.7.2' );

require_once __DIR__ . '/inc/autoload.php';
require_once __DIR__ . '/inc/namespace.php';

// Kick it off.
add_action( 'init', __NAMESPACE__ . '\\setup' );
