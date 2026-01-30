import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'SearchLinkControl component', () => {
	test.beforeEach( async ( { admin, editor } ) => {
		await admin.createNewPost();
		await editor.insertBlock( { name: 'gumponents-test/search-link-control' } );
	} );

	test( 'renders select URL button', async ( { page } ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-search-link-control"]'
		);
		await expect( container ).toBeVisible();
		await expect(
			container.getByRole( 'button', { name: 'Select URL' } )
		).toBeVisible();
	} );

	test( 'opens search modal on button click', async ( { page } ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-search-link-control"]'
		);
		await container
			.getByRole( 'button', { name: 'Select URL' } )
			.click();

		const modal = page.locator( '.components-modal__frame' );
		await expect( modal ).toBeVisible();

		// Should contain search-specific elements
		await expect( modal.getByLabel( 'New Tab' ) ).toBeVisible();
	} );

	test( 'fills URL manually and updates value', async ( { page } ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-search-link-control"]'
		);

		await container
			.getByRole( 'button', { name: 'Select URL' } )
			.click();

		const modal = page.locator( '.components-modal__frame' );

		// Fill URL input
		const urlInput = modal.locator( 'input[type="text"]' ).first();
		await urlInput.fill( 'https://example.com/page' );
		await page.waitForTimeout( 400 );

		// Fill Link Text
		await modal.getByLabel( 'Link Text' ).fill( 'Example Page' );

		// Close modal
		await modal
			.locator( 'role=button[name="Close"i]' )
			.click();

		await expect(
			page.locator( '[data-testid="search-link-url"]' )
		).toHaveText( 'https://example.com/page' );
		await expect(
			page.locator( '[data-testid="search-link-text"]' )
		).toHaveText( 'Example Page' );
	} );

	test( 'shows preview after setting link', async ( { page } ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-search-link-control"]'
		);

		await container
			.getByRole( 'button', { name: 'Select URL' } )
			.click();

		const modal = page.locator( '.components-modal__frame' );

		// Fill URL
		const urlInput = modal.locator( 'input[type="text"]' ).first();
		await urlInput.fill( 'https://example.com' );
		await page.waitForTimeout( 400 );

		// Fill text
		await modal.getByLabel( 'Link Text' ).fill( 'Test' );

		// Close
		await modal
			.locator( 'role=button[name="Close"i]' )
			.click();

		// Preview should be visible
		await expect(
			container.locator( '.gumponents-search-link-control__preview' )
		).toBeVisible();
	} );
} );
