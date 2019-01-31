<?php
/**
 * Autoloader.
 *
 * @package gumponents
 */

namespace JB\Gumponents;

/**
 * Autoloader for plugin.
 *
 * @param string $class Class name.
 */
function autoload( $class = '' ) {
	if ( 0 !== strpos( $class, __NAMESPACE__ ) ) {
		return;
	}

	$class_path = array_map(
		function ( $item ) {
			return str_replace( '_', '-', strtolower( implode( '-', preg_split( '/(?<=[a-z]) (?=[A-Z]) | (?<=[A-Z]) (?=[A-Z][a-z])/x', $item ) ) ) );
		},
		explode( '\\', str_replace( __NAMESPACE__ . '\\', '', $class ) )
	);

	$file_name = 'class-' . array_pop( $class_path ) . '.php';
	$path      = __DIR__ . DIRECTORY_SEPARATOR . ( ! empty( $class_path ) ? implode( DIRECTORY_SEPARATOR, $class_path ) . DIRECTORY_SEPARATOR : '' ) . $file_name;

	if ( file_exists( $path ) ) {
		require_once $path;
	}
}
spl_autoload_register( __NAMESPACE__ . '\\autoload' );
