import { useState } from '@wordpress/element';

const { PostRelationshipControl } = window.gumponents.components;

function Edit() {
	const [ selectedPostIds, setSelectedPostIds ] = useState< number[] >( [] );

	return (
		<div data-testid="gumponents-test-post-relationship-control">
			<PostRelationshipControl
				label="Test Post Relationship"
				value={ selectedPostIds }
				postTypes={ [ 'post', 'page' ] }
				buttonLabel="Select Posts"
				modalTitle="Select Posts"
				onSelect={ (
					values: Array< { ID: number } | Record< string, unknown > >
				) => {
					const ids = values.map( ( v ) =>
						'ID' in v ? ( v as { ID: number } ).ID : 0
					);
					setSelectedPostIds( ids );
				} }
			/>
			<div data-testid="post-relationship-ids">
				{ JSON.stringify( selectedPostIds ) }
			</div>
			<div data-testid="post-relationship-count">
				{ String( selectedPostIds.length ) }
			</div>
		</div>
	);
}

export default {
	title: 'Test: Post Relationship Control',
	category: 'common',
	edit: Edit,
	save: () => null,
};
