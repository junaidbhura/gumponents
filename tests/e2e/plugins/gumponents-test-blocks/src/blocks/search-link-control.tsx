import { useState } from '@wordpress/element';

const { SearchLinkControl } = window.gumponents.components;

interface LinkValue {
	url: string;
	text: string;
	newWindow: boolean;
}

function Edit() {
	const [ value, setValue ] = useState< LinkValue | null >( null );

	return (
		<div data-testid="gumponents-test-search-link-control">
			<SearchLinkControl
				label="Test Search Link"
				value={ value }
				onChange={ setValue }
				buttonLabel="Select URL"
				modalTitle="Search & Select URL"
				postTypes={ [ 'post', 'page' ] }
			/>
			<div data-testid="search-link-url">{ value?.url ?? '' }</div>
			<div data-testid="search-link-text">{ value?.text ?? '' }</div>
			<div data-testid="search-link-new-window">
				{ String( value?.newWindow ?? false ) }
			</div>
		</div>
	);
}

export default {
	title: 'Test: Search Link Control',
	category: 'common',
	edit: Edit,
	save: () => null,
};
