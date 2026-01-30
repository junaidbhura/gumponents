import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'FileControl component', () => {
	test.beforeEach( async ( { admin, editor } ) => {
		await admin.createNewPost();
		await editor.insertBlock( { name: 'gumponents-test/file-control' } );
	} );

	test( 'renders with select file button', async ( { page } ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-file-control"]'
		);
		await expect( container ).toBeVisible();

		const selectButton = container.locator(
			'.gumponents-file-control__select'
		);
		await expect( selectButton ).toBeVisible();
		await expect( selectButton ).toHaveText( 'Select file' );
	} );

	test( 'opens media modal on select button click', async ( { page } ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-file-control"]'
		);

		await container
			.locator( '.gumponents-file-control__select' )
			.click();

		const mediaModal = page.locator( '.media-modal' );
		await expect( mediaModal ).toBeVisible();
	} );
} );
