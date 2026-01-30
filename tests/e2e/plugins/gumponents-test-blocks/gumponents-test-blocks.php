<?php
/**
 * Plugin Name: Gumponents Test Blocks
 * Description: Test blocks for Gumponents e2e testing. Each block wraps a single Gumponent component.
 * Version: 0.0.0
 * Requires PHP: 8.3
 */

declare(strict_types=1);

namespace Gumponents\TestBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\\enqueue_editor_assets' );

function enqueue_editor_assets(): void {
	$asset_file = __DIR__ . '/build/index.asset.php';

	if ( ! file_exists( $asset_file ) ) {
		return;
	}

	$asset = require $asset_file;

	wp_enqueue_script(
		'gumponents-test-blocks',
		plugins_url( 'build/index.js', __FILE__ ),
		array_merge( $asset['dependencies'], [ 'gumponents-blocks' ] ),
		$asset['version'],
		true,
	);
}
