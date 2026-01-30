import { useState } from '@wordpress/element';

const { ColorPaletteControl } = window.gumponents.components;

const COLORS = [
	{ color: '#ff0000', slug: 'red', name: 'Red' },
	{ color: '#00ff00', slug: 'green', name: 'Green' },
	{ color: '#0000ff', slug: 'blue', name: 'Blue' },
];

function Edit() {
	const [ selectedColor, setSelectedColor ] = useState< string >( '' );
	const [ selectedSlug, setSelectedSlug ] = useState< string >( '' );

	return (
		<div data-testid="gumponents-test-color-palette-control">
			<ColorPaletteControl
				label="Test Color Palette"
				colors={ COLORS }
				value={ selectedColor || undefined }
				onChange={ (
					color: { color: string; slug?: string } | null
				) => {
					setSelectedColor( color?.color ?? '' );
					setSelectedSlug( color?.slug ?? '' );
				} }
				disableCustomColors={ true }
			/>
			<div data-testid="color-value">{ selectedColor }</div>
			<div data-testid="color-slug">{ selectedSlug }</div>
		</div>
	);
}

export default {
	title: 'Test: Color Palette Control',
	category: 'common',
	edit: Edit,
	save: () => null,
};
