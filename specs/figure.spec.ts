import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'Figure component', () => {
	test.beforeEach( async ( { admin, editor } ) => {
		await admin.createNewPost();
		await editor.insertBlock( { name: 'gumponents-test/figure' } );
	} );

	test( 'renders nothing when value is null', async ( { page } ) => {
		const output = page.locator( '[data-testid="figure-output"]' );
		await expect( output ).toBeAttached();
		await expect( output.locator( 'figure' ) ).toHaveCount( 0 );
	} );

	test( 'renders figure with img and figcaption when caption is present', async ( {
		page,
	} ) => {
		await page.click( '[data-testid="figure-set-default"]' );

		const output = page.locator( '[data-testid="figure-output"]' );
		const figure = output.locator( 'figure' );

		await expect( figure ).toBeVisible();
		await expect( figure.locator( 'img' ) ).toBeVisible();
		await expect( figure.locator( 'img' ) ).toHaveAttribute(
			'src',
			'https://example.com/test.png'
		);
		await expect( figure.locator( 'img' ) ).toHaveAttribute(
			'alt',
			'Test image'
		);
		await expect( figure.locator( 'figcaption' ) ).toBeVisible();
		await expect( figure.locator( 'figcaption' ) ).toHaveText(
			'Test caption'
		);
	} );

	test( 'renders figure without figcaption when caption is empty', async ( {
		page,
	} ) => {
		await page.click( '[data-testid="figure-set-no-caption"]' );

		const output = page.locator( '[data-testid="figure-output"]' );
		const figure = output.locator( 'figure' );

		await expect( figure ).toBeVisible();
		await expect( figure.locator( 'img' ) ).toBeVisible();
		await expect( figure.locator( 'figcaption' ) ).toHaveCount( 0 );
	} );

	test( 'clears figure when value is set to null', async ( { page } ) => {
		await page.click( '[data-testid="figure-set-default"]' );
		const output = page.locator( '[data-testid="figure-output"]' );
		await expect( output.locator( 'figure' ) ).toBeVisible();

		await page.click( '[data-testid="figure-clear"]' );
		await expect( output.locator( 'figure' ) ).toHaveCount( 0 );
	} );
} );
