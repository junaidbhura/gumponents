import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'PostRelationshipControl component', () => {
	let postTitle: string;

	test.beforeAll( async ( { requestUtils } ) => {
		postTitle = `Test Post ${ Date.now() }`;
		await requestUtils.createPost( {
			title: postTitle,
			status: 'publish',
		} );
	} );

	test.afterAll( async ( { requestUtils } ) => {
		await requestUtils.deleteAllPosts();
	} );

	test.beforeEach( async ( { admin, editor } ) => {
		await admin.createNewPost();
		await editor.insertBlock( { name: 'gumponents-test/post-relationship-control' } );
	} );

	test( 'renders select button', async ( { page } ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-post-relationship-control"]'
		);
		await expect( container ).toBeVisible();
		await expect(
			container.getByRole( 'button', { name: 'Select Posts' } )
		).toBeVisible();
	} );

	test( 'opens modal with search and panels', async ( { page } ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-post-relationship-control"]'
		);

		await container
			.getByRole( 'button', { name: 'Select Posts' } )
			.click();

		const modal = page.locator( '.gumponent-relationship__modal' );
		await expect( modal ).toBeVisible();

		// Search input
		await expect(
			modal.locator( '.gumponent-relationship__search' )
		).toBeVisible();

		// Search results panel
		await expect(
			modal.locator(
				'.gumponent-relationship__panel__search-items'
			)
		).toBeVisible();

		// Selected items panel
		await expect(
			modal.locator(
				'.gumponent-relationship__panel__selected-items'
			)
		).toBeVisible();
	} );

	test( 'searches for posts and displays results', async ( { page } ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-post-relationship-control"]'
		);

		await container
			.getByRole( 'button', { name: 'Select Posts' } )
			.click();

		const modal = page.locator( '.gumponent-relationship__modal' );

		// Wait for initial results to load
		await page.waitForTimeout( 500 );

		// Search items panel should have items loaded
		const searchItemsPanel = modal.locator(
			'.gumponent-relationship__panel__search-items'
		);
		await expect( searchItemsPanel.locator( 'li' ).first() ).toBeVisible( {
			timeout: 10000,
		} );
	} );

	test( 'selects an item and confirms selection', async ( { page } ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-post-relationship-control"]'
		);

		await container
			.getByRole( 'button', { name: 'Select Posts' } )
			.click();

		const modal = page.locator( '.gumponent-relationship__modal' );

		// Wait for results
		const searchItemsPanel = modal.locator(
			'.gumponent-relationship__panel__search-items'
		);
		await expect( searchItemsPanel.locator( 'li' ).first() ).toBeVisible( {
			timeout: 10000,
		} );

		// Click first search result
		await searchItemsPanel.locator( 'li' ).first().click();

		// Should appear in selected panel
		const selectedItemsPanel = modal.locator(
			'.gumponent-relationship__panel__selected-items'
		);
		await expect(
			selectedItemsPanel.locator( 'li' ).first()
		).toBeVisible();

		// Click Select button to confirm
		await modal
			.getByRole( 'button', { name: 'Select', exact: true } )
			.click();

		// Modal should close
		await expect( modal ).not.toBeVisible();
	} );
} );
