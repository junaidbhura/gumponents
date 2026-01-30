import { useState } from '@wordpress/element';

const { MultiSelectControl } = window.gumponents.components;

const OPTIONS = [
	{ label: 'Apple', value: 'apple' },
	{ label: 'Banana', value: 'banana' },
	{ label: 'Cherry', value: 'cherry' },
	{ label: 'Date', value: 'date' },
];

function Edit() {
	const [ selectedValues, setSelectedValues ] = useState< string[] >( [] );

	return (
		<div data-testid="gumponents-test-multiselect-control">
			<MultiSelectControl
				label="Test Multi Select"
				options={ OPTIONS }
				value={ selectedValues }
				onChange={ setSelectedValues }
				placeholder="Select fruits..."
			/>
			<div data-testid="multiselect-value">
				{ JSON.stringify( selectedValues ) }
			</div>
		</div>
	);
}

export default {
	title: 'Test: MultiSelect Control',
	category: 'common',
	edit: Edit,
	save: () => null,
};
