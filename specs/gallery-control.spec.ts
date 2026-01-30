import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'GalleryControl component', () => {
	test.beforeEach( async ( { admin, editor } ) => {
		await admin.createNewPost();
		await editor.insertBlock( { name: 'gumponents-test/gallery-control' } );
	} );

	test( 'renders with select images button in empty state', async ( {
		page,
	} ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-gallery-control"]'
		);
		await expect( container ).toBeVisible();

		const selectButton = container.locator(
			'.gumponents-gallery-control__select'
		);
		await expect( selectButton ).toBeVisible();
		await expect( selectButton ).toHaveText( 'Select images' );
	} );

	test( 'opens media gallery modal on button click', async ( {
		page,
	} ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-gallery-control"]'
		);

		await container
			.locator( '.gumponents-gallery-control__select' )
			.click();

		const mediaModal = page.locator( '.media-modal' );
		await expect( mediaModal ).toBeVisible();
	} );

	test( 'shows zero count initially', async ( { page } ) => {
		await expect(
			page.locator( '[data-testid="gallery-control-count"]' )
		).toHaveText( '0' );
	} );
} );
