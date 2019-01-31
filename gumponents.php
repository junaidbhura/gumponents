<?php
/**
 * Plugin Name: Gumponents
 * Description: Advanced Gutenberg components for WordPress.
 * Author: Junaid Bhura
 * Author URI: https://junaidbhura.com
 * Version: 0.0.8
 *
 * @package gumponents
 */

namespace JB\Gumponents;

require_once __DIR__ . '/inc/autoload.php';
require_once __DIR__ . '/inc/namespace.php';

// Kick it off.
add_action( 'init', __NAMESPACE__ . '\\setup' );
