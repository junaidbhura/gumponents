import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'SelectImage component', () => {
	test.beforeEach( async ( { admin, editor } ) => {
		await admin.createNewPost();
		await editor.insertBlock( { name: 'gumponents-test/select-image' } );
	} );

	test( 'renders placeholder in empty state', async ( { page } ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-select-image"]'
		);
		await expect( container ).toBeVisible();

		// SelectImage should show placeholder via ImageContainer
		await expect(
			container.locator( '.gumponents-select-image' )
		).toBeVisible();
	} );

	test( 'opens media modal when clicking placeholder', async ( {
		page,
	} ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-select-image"]'
		);

		// Click on the placeholder area to open media modal
		await container
			.locator( '.gumponents-select-image' )
			.click( { position: { x: 50, y: 50 } } );

		// Check if media modal opened
		const mediaModal = page.locator( '.media-modal' );
		await expect( mediaModal ).toBeVisible( { timeout: 5000 } );
	} );
} );
