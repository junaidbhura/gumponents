import './editor.scss';

import wp from 'wp';
const {
	BaseControl,
	ColorPalette,
} = wp.components;
const { select } = wp.data;

export default function ColorPaletteControl( { label, help, value, colors = null, onChange, disableCustomColors = null } ) {
	if ( null === colors ) {
		colors = select( 'core/block-editor' ).getSettings().colors || [];
	}
	if ( null === disableCustomColors ) {
		disableCustomColors = select( 'core/block-editor' ).getSettings().disableCustomColors;
	}

	const onColorChange = ( color ) => {
		if ( ! onChange || 0 === colors.length ) {
			return;
		}

		let colorObject = {
			color,
		};
		colors.some( ( item ) => {
			if ( 'slug' in item && 'color' in item && color === item.color ) {
				colorObject.slug = item.slug;
				return true;
			}
		} );

		onChange( colorObject );
	};

	return (
		<BaseControl
			label={ label }
			help={ help }
			className="gumponents-color-palette-control"
		>
			<ColorPalette
				colors={ colors }
				value={ value }
				onChange={ ( color ) => onColorChange( color ) }
				disableCustomColors={ disableCustomColors }
			/>
		</BaseControl>
	);
}
