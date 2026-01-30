import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'ImageControl component', () => {
	test.beforeEach( async ( { admin, editor } ) => {
		await admin.createNewPost();
		await editor.insertBlock( { name: 'gumponents-test/image-control' } );
	} );

	test( 'renders with select image button in empty state', async ( {
		page,
	} ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-image-control"]'
		);
		await expect( container ).toBeVisible();

		const selectButton = container.locator(
			'.editor-post-featured-image__toggle'
		);
		await expect( selectButton ).toBeVisible();
		await expect( selectButton ).toHaveText( 'Select image' );
	} );

	test( 'opens media modal on select button click', async ( { page } ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-image-control"]'
		);

		await container
			.locator( '.editor-post-featured-image__toggle' )
			.click();

		// WordPress media modal
		const mediaModal = page.locator( '.media-modal' );
		await expect( mediaModal ).toBeVisible();
	} );
} );
