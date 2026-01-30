import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'LinkButton component', () => {
	test.beforeEach( async ( { admin, page } ) => {
		await admin.createNewPost();
		await page.click( 'role=button[name="Toggle block inserter"i]' );
		await page.fill(
			'role=searchbox[name="Search for blocks and patterns"i]',
			'Test: Link Button'
		);
		await page.click( 'role=option[name="Test: Link Button"i]' );
		await page.click( 'role=button[name="Toggle block inserter"i]' );
	} );

	test( 'renders button with placeholder text', async ( { page } ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-link-button"]'
		);
		await expect( container ).toBeVisible();

		const button = container.locator( '.gumponents-link-button' );
		await expect( button ).toBeVisible();
		await expect( button ).toHaveText( 'Click me' );
	} );

	test( 'opens URL modal on button click', async ( { page } ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-link-button"]'
		);
		await container.locator( '.gumponents-link-button' ).click();

		const modal = page.locator( '.components-modal__frame' );
		await expect( modal ).toBeVisible();
	} );

	test( 'updates button text after setting link', async ( { page } ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-link-button"]'
		);

		// Open modal
		await container.locator( '.gumponents-link-button' ).click();

		const modal = page.locator( '.components-modal__frame' );

		// Fill URL
		await modal.locator( 'role=textbox[name="URL"i]' ).fill( 'https://example.com' );
		await page.waitForTimeout( 400 );

		// Fill Link Text
		await modal.getByLabel( 'Link Text' ).fill( 'My Button' );

		// Close modal
		await modal
			.locator( 'role=button[name="Close"i]' )
			.click();

		// Button text should update
		const button = container.locator( '.gumponents-link-button' );
		await expect( button ).toHaveText( 'My Button' );

		// Values should be reflected
		await expect(
			page.locator( '[data-testid="link-button-url"]' )
		).toHaveText( 'https://example.com' );
		await expect(
			page.locator( '[data-testid="link-button-text"]' )
		).toHaveText( 'My Button' );
	} );
} );
