import { useState } from '@wordpress/element';

const { LinkControl } = window.gumponents.components;

interface LinkValue {
	url: string;
	text: string;
	newWindow: boolean;
}

function Edit() {
	const [ value, setValue ] = useState< LinkValue | null >( null );

	return (
		<div data-testid="gumponents-test-link-control">
			<LinkControl
				label="Test Link"
				value={ value }
				onChange={ setValue }
				buttonLabel="Select link"
				modalTitle="URL"
			/>
			<div data-testid="link-control-url">{ value?.url ?? '' }</div>
			<div data-testid="link-control-text">{ value?.text ?? '' }</div>
			<div data-testid="link-control-new-window">
				{ String( value?.newWindow ?? false ) }
			</div>
		</div>
	);
}

export default {
	title: 'Test: Link Control',
	category: 'common',
	edit: Edit,
	save: () => null,
};
