import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'FocalPointPickerControl component', () => {
	test.beforeEach( async ( { admin, page } ) => {
		await admin.createNewPost();
		await page.click( 'role=button[name="Toggle block inserter"i]' );
		await page.fill(
			'role=searchbox[name="Search for blocks and patterns"i]',
			'Test: Focal Point'
		);
		await page.click(
			'role=option[name="Test: Focal Point Picker Control"i]'
		);
		await page.click( 'role=button[name="Toggle block inserter"i]' );
	} );

	test( 'renders select button when imageUrl is provided', async ( {
		page,
	} ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-focal-point-picker-control"]'
		);
		await expect( container ).toBeVisible();

		await expect(
			container.getByRole( 'button', {
				name: 'Select Focal Point',
			} )
		).toBeVisible();
	} );

	test( 'opens modal with focal point picker on button click', async ( {
		page,
	} ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-focal-point-picker-control"]'
		);

		await container
			.getByRole( 'button', { name: 'Select Focal Point' } )
			.click();

		const modal = page.locator( '.components-modal__frame' );
		await expect( modal ).toBeVisible();

		// FocalPointPicker should be rendered inside the modal
		await expect(
			modal.locator( '.components-focal-point-picker-wrapper' )
		).toBeVisible();
	} );

	test( 'displays default focal point values', async ( { page } ) => {
		await expect(
			page.locator( '[data-testid="focal-point-x"]' )
		).toHaveText( '0.5' );
		await expect(
			page.locator( '[data-testid="focal-point-y"]' )
		).toHaveText( '0.5' );
	} );
} );
