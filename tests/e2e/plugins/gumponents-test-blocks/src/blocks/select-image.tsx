import { useState } from '@wordpress/element';

const { SelectImage } = window.gumponents.components;

interface ImageDetails {
	id: number;
	src: string;
	width: number;
	height: number;
	alt: string;
	caption: string;
	title: string;
	size: string;
}

function Edit() {
	const [ image, setImage ] = useState< ImageDetails | null >( null );

	return (
		<div data-testid="gumponents-test-select-image">
			<SelectImage
				image={ image }
				placeholder="Select an image"
				showCaption={ true }
				onChange={ ( img: ImageDetails ) => {
					setImage( img.id ? img : null );
				} }
			/>
			<div data-testid="select-image-id">
				{ String( image?.id ?? '' ) }
			</div>
			<div data-testid="select-image-alt">
				{ image?.alt ?? '' }
			</div>
		</div>
	);
}

export default {
	title: 'Test: Select Image',
	category: 'common',
	edit: Edit,
	save: () => null,
};
