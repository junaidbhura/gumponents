import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'TaxonomyRelationshipControl component', () => {
	test.beforeEach( async ( { admin, page } ) => {
		await admin.createNewPost();
		await page.click( 'role=button[name="Toggle block inserter"i]' );
		await page.fill(
			'role=searchbox[name="Search for blocks and patterns"i]',
			'Test: Taxonomy Relationship'
		);
		await page.click(
			'role=option[name="Test: Taxonomy Relationship Control"i]'
		);
		await page.click( 'role=button[name="Toggle block inserter"i]' );
	} );

	test( 'renders select button', async ( { page } ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-taxonomy-relationship-control"]'
		);
		await expect( container ).toBeVisible();
		await expect(
			container.getByRole( 'button', { name: 'Select Terms' } )
		).toBeVisible();
	} );

	test( 'opens modal with search and panels', async ( { page } ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-taxonomy-relationship-control"]'
		);

		await container
			.getByRole( 'button', { name: 'Select Terms' } )
			.click();

		const modal = page.locator( '.gumponent-relationship__modal' );
		await expect( modal ).toBeVisible();

		// Search input
		await expect(
			modal.locator( '.gumponent-relationship__search' )
		).toBeVisible();

		// Both panels
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

	test( 'loads taxonomy terms in search results', async ( { page } ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-taxonomy-relationship-control"]'
		);

		await container
			.getByRole( 'button', { name: 'Select Terms' } )
			.click();

		const modal = page.locator( '.gumponent-relationship__modal' );

		// Wait for initial results
		const searchItemsPanel = modal.locator(
			'.gumponent-relationship__panel__search-items'
		);
		await expect( searchItemsPanel.locator( 'li' ).first() ).toBeVisible( {
			timeout: 10000,
		} );
	} );

	test( 'selects a term and confirms', async ( { page } ) => {
		const container = page.locator(
			'[data-testid="gumponents-test-taxonomy-relationship-control"]'
		);

		await container
			.getByRole( 'button', { name: 'Select Terms' } )
			.click();

		const modal = page.locator( '.gumponent-relationship__modal' );

		const searchItemsPanel = modal.locator(
			'.gumponent-relationship__panel__search-items'
		);
		await expect( searchItemsPanel.locator( 'li' ).first() ).toBeVisible( {
			timeout: 10000,
		} );

		// Click first result
		await searchItemsPanel.locator( 'li' ).first().click();

		// Confirm selection
		await modal
			.getByRole( 'button', { name: 'Select', exact: true } )
			.click();

		await expect( modal ).not.toBeVisible();
	} );
} );
