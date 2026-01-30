import './editor.scss';

import { BaseControl, ColorPalette } from '@wordpress/components';
import { select } from '@wordpress/data';

interface ColorObject {
	color: string;
	slug?: string;
}

interface ColorPaletteControlProps {
	label?: string;
	help?: string;
	value?: string;
	colors?: Array< { color: string; slug: string; name: string } > | null;
	onChange?: ( color: ColorObject | null ) => void;
	disableCustomColors?: boolean | null;
}

export default function ColorPaletteControl( {
	label,
	help,
	value,
	colors = null,
	onChange,
	disableCustomColors = null,
}: ColorPaletteControlProps ) {
	let resolvedColors = colors;
	let resolvedDisableCustom = disableCustomColors;

	if ( resolvedColors === null ) {
		resolvedColors = select( 'core/block-editor' ).getSettings().colors || [];
	}
	if ( resolvedDisableCustom === null ) {
		resolvedDisableCustom = select( 'core/block-editor' ).getSettings().disableCustomColors;
	}

	const onColorChange = ( color?: string ) => {
		if ( ! onChange || resolvedColors!.length === 0 ) {
			return;
		}

		let colorObject: ColorObject | null = null;
		if ( typeof color !== 'undefined' ) {
			colorObject = { color };
			resolvedColors!.some( ( item ) => {
				if ( 'slug' in item && 'color' in item && color === item.color ) {
					colorObject!.slug = item.slug;
					return true;
				}
				return false;
			} );
		}

		onChange( colorObject );
	};

	return (
		<BaseControl
			label={ label }
			help={ help }
			className="gumponents-color-palette-control"
		>
			<ColorPalette
				colors={ resolvedColors! }
				value={ value }
				onChange={ ( color ) => onColorChange( color ) }
				disableCustomColors={ resolvedDisableCustom ?? false }
			/>
		</BaseControl>
	);
}
