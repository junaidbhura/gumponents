import { useState } from '@wordpress/element';

const { LinkButton } = window.gumponents.components;

interface LinkValue {
	url: string;
	text: string;
	newWindow: boolean;
}

function Edit() {
	const [ value, setValue ] = useState< LinkValue | null >( null );

	return (
		<div data-testid="gumponents-test-link-button">
			<LinkButton
				value={ value }
				onChange={ setValue }
				placeholder="Click me"
				modalTitle="URL"
			/>
			<div data-testid="link-button-url">{ value?.url ?? '' }</div>
			<div data-testid="link-button-text">{ value?.text ?? '' }</div>
			<div data-testid="link-button-new-window">
				{ String( value?.newWindow ?? false ) }
			</div>
		</div>
	);
}

export default {
	title: 'Test: Link Button',
	category: 'common',
	edit: Edit,
	save: () => null,
};
