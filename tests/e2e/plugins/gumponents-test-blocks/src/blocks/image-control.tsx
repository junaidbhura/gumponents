import { useState } from '@wordpress/element';

const { ImageControl } = window.gumponents.components;

function Edit() {
	const [ imageId, setImageId ] = useState< number | null >( null );
	const [ imageSrc, setImageSrc ] = useState< string >( '' );

	return (
		<div data-testid="gumponents-test-image-control">
			<ImageControl
				label="Test Image"
				value={ imageId }
				onChange={ (
					image: { id: number; src: string } | null
				) => {
					setImageId( image?.id ?? null );
					setImageSrc( image?.src ?? '' );
				} }
			/>
			<div data-testid="image-control-id">
				{ String( imageId ?? '' ) }
			</div>
			<div data-testid="image-control-src">{ imageSrc }</div>
		</div>
	);
}

export default {
	title: 'Test: Image Control',
	category: 'common',
	edit: Edit,
	save: () => null,
};
