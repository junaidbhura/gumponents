import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'ColorPaletteControl component', () => {
	test.beforeEach( async ( { admin, editor } ) => {
		await admin.createNewPost();
		await editor.insertBlock( { name: 'gumponents-test/color-palette-control' } );
	} );

	test( 'renders color swatches', async ( { page } ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-color-palette-control"]'
		);
		await expect( container ).toBeVisible();

		// WordPress ColorPalette renders buttons with aria-label "Color: <name>"
		await expect(
			container.locator( 'role=button[name="Color: Red"i]' )
		).toBeVisible();
		await expect(
			container.locator( 'role=button[name="Color: Green"i]' )
		).toBeVisible();
		await expect(
			container.locator( 'role=button[name="Color: Blue"i]' )
		).toBeVisible();
	} );

	test( 'selects a color and updates value with slug', async ( {
		page,
	} ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-color-palette-control"]'
		);

		await container
			.locator( 'role=button[name="Color: Red"i]' )
			.click();

		await expect( page.locator( '[data-testid="color-value"]' ) ).toHaveText(
			'#ff0000'
		);
		await expect( page.locator( '[data-testid="color-slug"]' ) ).toHaveText(
			'red'
		);
	} );

	test( 'changes color selection', async ( { page } ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-color-palette-control"]'
		);

		await container
			.locator( 'role=button[name="Color: Red"i]' )
			.click();
		await expect( page.locator( '[data-testid="color-value"]' ) ).toHaveText(
			'#ff0000'
		);

		await container
			.locator( 'role=button[name="Color: Blue"i]' )
			.click();
		await expect( page.locator( '[data-testid="color-value"]' ) ).toHaveText(
			'#0000ff'
		);
		await expect( page.locator( '[data-testid="color-slug"]' ) ).toHaveText(
			'blue'
		);
	} );
} );
