import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'MultiSelectControl component', () => {
	test.beforeEach( async ( { admin, editor } ) => {
		await admin.createNewPost();
		await editor.insertBlock( { name: 'gumponents-test/multiselect-control' } );
	} );

	test( 'renders react-select with placeholder', async ( { page } ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-multiselect-control"]'
		);
		await expect( container ).toBeVisible();

		const placeholder = container.locator( '.gumponents-multi-select-control .css-1jqq78o-placeholder, .gumponents-multi-select-control [class*="placeholder"]' );
		await expect( placeholder ).toHaveText( 'Select fruits...' );
	} );

	test( 'selects an option and updates value', async ( { page } ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-multiselect-control"]'
		);

		// Click the react-select input area
		await container
			.locator( '.gumponents-multi-select-control [class*="control"]' )
			.first()
			.click();

		// Type to search and select "Apple"
		await page.keyboard.type( 'Apple' );
		await page.keyboard.press( 'Enter' );

		const value = page.locator( '[data-testid="multiselect-value"]' );
		await expect( value ).toHaveText( '["apple"]' );
	} );

	test( 'selects multiple options', async ( { page } ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-multiselect-control"]'
		);

		// Select Apple
		await container
			.locator( '.gumponents-multi-select-control [class*="control"]' )
			.first()
			.click();
		await page.keyboard.type( 'Apple' );
		await page.keyboard.press( 'Enter' );

		// Select Cherry
		await page.keyboard.type( 'Cherry' );
		await page.keyboard.press( 'Enter' );

		const value = page.locator( '[data-testid="multiselect-value"]' );
		await expect( value ).toHaveText( '["apple","cherry"]' );
	} );
} );
