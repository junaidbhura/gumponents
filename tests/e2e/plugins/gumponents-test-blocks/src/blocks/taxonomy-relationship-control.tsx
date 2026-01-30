import { useState } from '@wordpress/element';

const { TaxonomyRelationshipControl } = window.gumponents.components;

function Edit() {
	const [ selectedTermIds, setSelectedTermIds ] = useState< number[] >( [] );

	return (
		<div data-testid="gumponents-test-taxonomy-relationship-control">
			<TaxonomyRelationshipControl
				label="Test Taxonomy Relationship"
				value={ selectedTermIds }
				taxonomies={ [ 'category', 'post_tag' ] }
				buttonLabel="Select Terms"
				modalTitle="Select Terms"
				onSelect={ (
					values: Array<
						{ term_id: number } | Record< string, unknown >
					>
				) => {
					const ids = values.map( ( v ) =>
						'term_id' in v
							? ( v as { term_id: number } ).term_id
							: 0
					);
					setSelectedTermIds( ids );
				} }
			/>
			<div data-testid="taxonomy-relationship-ids">
				{ JSON.stringify( selectedTermIds ) }
			</div>
			<div data-testid="taxonomy-relationship-count">
				{ String( selectedTermIds.length ) }
			</div>
		</div>
	);
}

export default {
	title: 'Test: Taxonomy Relationship Control',
	category: 'common',
	edit: Edit,
	save: () => null,
};
