import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'GalleryControl component', () => {
	test.beforeEach( async ( { admin, page } ) => {
		await admin.createNewPost();
		await page.click( 'role=button[name="Toggle block inserter"i]' );
		await page.fill(
			'role=searchbox[name="Search for blocks and patterns"i]',
			'Test: Gallery Control'
		);
		await page.click(
			'role=option[name="Test: Gallery Control"i]'
		);
		await page.click( 'role=button[name="Toggle block inserter"i]' );
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
