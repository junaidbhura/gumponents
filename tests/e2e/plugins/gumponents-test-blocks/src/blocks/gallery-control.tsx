import { useState } from '@wordpress/element';

const { GalleryControl } = window.gumponents.components;

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
	const [ images, setImages ] = useState< ImageDetails[] >( [] );

	return (
		<div data-testid="gumponents-test-gallery-control">
			<GalleryControl
				label="Test Gallery"
				value={ images }
				onSelect={ ( selected: ImageDetails[] ) => {
					setImages( selected );
				} }
			/>
			<div data-testid="gallery-control-count">
				{ String( images.length ) }
			</div>
			<div data-testid="gallery-control-ids">
				{ JSON.stringify( images.map( ( img ) => img.id ) ) }
			</div>
		</div>
	);
}

export default {
	title: 'Test: Gallery Control',
	category: 'common',
	edit: Edit,
	save: () => null,
};
