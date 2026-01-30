import { useState } from '@wordpress/element';

const { RelationshipControl } = window.gumponents.components;

function Edit() {
	const [ selectedItemIds, setSelectedItemIds ] = useState< number[] >( [] );

	return (
		<div data-testid="gumponents-test-relationship-control">
			<RelationshipControl
				label="Test Relationship"
				value={ selectedItemIds }
				searchApiPath="/gumponents/relationship/v1/posts/query"
				getItemsApiPath="/gumponents/relationship/v1/posts/initialize"
				buttonLabel="Select Items"
				modalTitle="Select Items"
				onSelect={ (
					values: Array< Record< string, unknown > >
				) => {
					const ids = values.map( ( v ) =>
						'ID' in v ? ( v as { ID: number } ).ID : 0
					);
					setSelectedItemIds( ids );
				} }
			/>
			<div data-testid="relationship-control-ids">
				{ JSON.stringify( selectedItemIds ) }
			</div>
			<div data-testid="relationship-control-count">
				{ String( selectedItemIds.length ) }
			</div>
		</div>
	);
}

export default {
	title: 'Test: Relationship Control',
	category: 'common',
	edit: Edit,
	save: () => null,
};
