import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'LinkControl component', () => {
	test.beforeEach( async ( { admin, editor } ) => {
		await admin.createNewPost();
		await editor.insertBlock( { name: 'gumponents-test/link-control' } );
	} );

	test( 'renders select link button', async ( { page } ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-link-control"]'
		);
		await expect( container ).toBeVisible();
		await expect(
			container.getByRole( 'button', { name: 'Select link' } )
		).toBeVisible();
	} );

	test( 'opens URL modal on button click', async ( { page } ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-link-control"]'
		);
		await container
			.getByRole( 'button', { name: 'Select link' } )
			.click();

		// Modal should be visible
		const modal = page.locator( '.components-modal__frame' );
		await expect( modal ).toBeVisible();

		// Modal should contain URL input, Link Text, and New Tab toggle
		await expect(
			modal.locator( 'role=textbox[name="URL"i]' )
		).toBeVisible();
		await expect(
			modal.getByLabel( 'Link Text' )
		).toBeVisible();
		await expect(
			modal.getByLabel( 'New Tab' )
		).toBeVisible();
	} );

	test( 'fills URL and text, shows preview', async ( { page } ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-link-control"]'
		);

		// Open modal
		await container
			.getByRole( 'button', { name: 'Select link' } )
			.click();

		const modal = page.locator( '.components-modal__frame' );

		// Fill URL
		await modal.locator( 'role=textbox[name="URL"i]' ).fill( 'https://example.com' );
		// Wait for debounce
		await page.waitForTimeout( 400 );

		// Fill Link Text
		await modal.getByLabel( 'Link Text' ).fill( 'Example Link' );

		// Close modal
		await modal
			.locator( 'role=button[name="Close"i]' )
			.click();

		// Verify values updated
		await expect(
			page.locator( '[data-testid="link-control-url"]' )
		).toHaveText( 'https://example.com' );
		await expect(
			page.locator( '[data-testid="link-control-text"]' )
		).toHaveText( 'Example Link' );

		// Preview link should be visible
		await expect(
			container.locator( '.gumponents-link-control__preview a' )
		).toBeVisible();
	} );

	test( 'toggles new window option', async ( { page } ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-link-control"]'
		);

		await container
			.getByRole( 'button', { name: 'Select link' } )
			.click();

		const modal = page.locator( '.components-modal__frame' );

		// Fill URL first
		await modal.locator( 'role=textbox[name="URL"i]' ).fill( 'https://example.com' );
		await page.waitForTimeout( 400 );

		// Toggle new window
		await modal.getByLabel( 'New Tab' ).click();

		// Close modal
		await modal
			.locator( 'role=button[name="Close"i]' )
			.click();

		await expect(
			page.locator( '[data-testid="link-control-new-window"]' )
		).toHaveText( 'true' );
	} );
} );
