import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'Img component', () => {
	test.beforeEach( async ( { admin, editor } ) => {
		await admin.createNewPost();
		await editor.insertBlock( { name: 'gumponents-test/img' } );
	} );

	test( 'renders nothing when value is null', async ( { page } ) => {
		const output = page.locator( '[data-testid="img-output"]' );
		await expect( output ).toBeAttached();
		await expect( output.locator( 'img' ) ).toHaveCount( 0 );
	} );

	test( 'renders img element with correct attributes when given ImageDetails', async ( {
		page,
	} ) => {
		await page.click( '[data-testid="img-set-default"]' );

		const output = page.locator( '[data-testid="img-output"]' );
		const img = output.locator( 'img' );

		await expect( img ).toBeVisible();
		await expect( img ).toHaveAttribute( 'src', 'https://example.com/test.png' );
		await expect( img ).toHaveAttribute( 'alt', 'Test image' );
		await expect( img ).toHaveAttribute( 'width', '640' );
		await expect( img ).toHaveAttribute( 'height', '480' );
		await expect( img ).toHaveAttribute( 'title', 'Test Title' );
		await expect( img ).toHaveClass( /wp-image-1/ );
		await expect( img ).toHaveClass( /size-full/ );
	} );

	test( 'clears image when value is set to null', async ( { page } ) => {
		await page.click( '[data-testid="img-set-default"]' );
		const output = page.locator( '[data-testid="img-output"]' );
		await expect( output.locator( 'img' ) ).toBeVisible();

		await page.click( '[data-testid="img-clear"]' );
		await expect( output.locator( 'img' ) ).toHaveCount( 0 );
	} );
} );
