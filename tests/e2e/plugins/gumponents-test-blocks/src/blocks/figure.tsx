import { useState } from '@wordpress/element';
import { TextareaControl, Button } from '@wordpress/components';

const { Figure } = window.gumponents.components;

const DEFAULT_IMAGE_DATA = JSON.stringify( {
	id: 1,
	src: 'https://example.com/test.png',
	width: 640,
	height: 480,
	alt: 'Test image',
	caption: 'Test caption',
	title: 'Test Title',
	size: 'full',
} );

const NO_CAPTION_IMAGE_DATA = JSON.stringify( {
	id: 2,
	src: 'https://example.com/test2.png',
	width: 320,
	height: 240,
	alt: 'No caption image',
	caption: '',
	title: 'No Caption',
	size: 'full',
} );

function Edit() {
	const [ imageData, setImageData ] = useState< string >( '' );

	return (
		<div data-testid="gumponents-test-figure">
			<TextareaControl
				label="Image Data (JSON)"
				value={ imageData }
				onChange={ setImageData }
				data-testid="figure-input"
			/>
			<Button
				variant="secondary"
				onClick={ () => setImageData( DEFAULT_IMAGE_DATA ) }
				data-testid="figure-set-default"
			>
				Set Default (with caption)
			</Button>
			<Button
				variant="secondary"
				onClick={ () => setImageData( NO_CAPTION_IMAGE_DATA ) }
				data-testid="figure-set-no-caption"
			>
				Set No Caption
			</Button>
			<Button
				variant="secondary"
				onClick={ () => setImageData( '' ) }
				data-testid="figure-clear"
			>
				Clear
			</Button>
			<div data-testid="figure-output">
				<Figure value={ imageData || null } />
			</div>
		</div>
	);
}

export default {
	title: 'Test: Figure',
	category: 'common',
	edit: Edit,
	save: () => null,
};
