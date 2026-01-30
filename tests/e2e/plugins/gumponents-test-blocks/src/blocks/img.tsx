import { useState } from '@wordpress/element';
import { TextareaControl, Button } from '@wordpress/components';

const { Img } = window.gumponents.components;

const DEFAULT_IMAGE_DATA = JSON.stringify( {
	id: 1,
	src: 'https://example.com/test.png',
	width: 640,
	height: 480,
	alt: 'Test image',
	caption: '',
	title: 'Test Title',
	size: 'full',
} );

function Edit() {
	const [ imageData, setImageData ] = useState< string >( '' );

	return (
		<div data-testid="gumponents-test-img">
			<TextareaControl
				label="Image Data (JSON)"
				value={ imageData }
				onChange={ setImageData }
				data-testid="img-input"
			/>
			<Button
				variant="secondary"
				onClick={ () => setImageData( DEFAULT_IMAGE_DATA ) }
				data-testid="img-set-default"
			>
				Set Default Image
			</Button>
			<Button
				variant="secondary"
				onClick={ () => setImageData( '' ) }
				data-testid="img-clear"
			>
				Clear
			</Button>
			<div data-testid="img-output">
				<Img value={ imageData || null } />
			</div>
		</div>
	);
}

export default {
	title: 'Test: Img',
	category: 'common',
	edit: Edit,
	save: () => null,
};
