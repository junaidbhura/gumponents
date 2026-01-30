import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'RelationshipControl component', () => {
	test.beforeAll( async ( { requestUtils } ) => {
		await requestUtils.createPost( {
			title: `Relationship Test Post ${ Date.now() }`,
			status: 'publish',
		} );
	} );

	test.afterAll( async ( { requestUtils } ) => {
		await requestUtils.deleteAllPosts();
	} );

	test.beforeEach( async ( { admin, page } ) => {
		await admin.createNewPost();
		await page.click( 'role=button[name="Toggle block inserter"i]' );
		await page.fill(
			'role=searchbox[name="Search for blocks and patterns"i]',
			'Test: Relationship Control'
		);
		await page.click(
			'role=option[name="Test: Relationship Control"i]'
		);
		await page.click( 'role=button[name="Toggle block inserter"i]' );
	} );

	test( 'renders select button', async ( { page } ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-relationship-control"]'
		);
		await expect( container ).toBeVisible();
		await expect(
			container.getByRole( 'button', { name: 'Select Items' } )
		).toBeVisible();
	} );

	test( 'opens modal with search and panels', async ( { page } ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-relationship-control"]'
		);

		await container
			.getByRole( 'button', { name: 'Select Items' } )
			.click();

		const modal = page.locator( '.gumponent-relationship__modal' );
		await expect( modal ).toBeVisible();

		await expect(
			modal.locator( '.gumponent-relationship__search' )
		).toBeVisible();
		await expect(
			modal.locator(
				'.gumponent-relationship__panel__search-items'
			)
		).toBeVisible();
		await expect(
			modal.locator(
				'.gumponent-relationship__panel__selected-items'
			)
		).toBeVisible();
	} );

	test( 'searches and selects items', async ( { page } ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-relationship-control"]'
		);

		await container
			.getByRole( 'button', { name: 'Select Items' } )
			.click();

		const modal = page.locator( '.gumponent-relationship__modal' );

		// Wait for initial results to load
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

		// Confirm
		await modal
			.getByRole( 'button', { name: 'Select', exact: true } )
			.click();

		await expect( modal ).not.toBeVisible();
	} );
} );
