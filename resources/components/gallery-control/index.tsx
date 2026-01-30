import './editor.scss';

import { __ } from '@wordpress/i18n';
import { Button, BaseControl } from '@wordpress/components';
import { MediaUpload } from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';
import { getImageDetails } from '../image-control';
import type { ImageDetails, MediaItem } from '../../types';

interface GalleryControlProps {
	value?: Array< ImageDetails | number >;
	size?: string;
	help?: string;
	onSelect?: ( images: ImageDetails[], mediaItems: MediaItem[] ) => void;
	label?: string;
	selectLabel?: string;
	updateLabel?: string;
	removeLabel?: string;
}

export default function GalleryControl( {
	value = [],
	size = 'full',
	help,
	onSelect,
	label = __( 'Select images' ),
	selectLabel = __( 'Select images' ),
	updateLabel = __( 'Update images' ),
	removeLabel = __( 'Remove images' ),
}: GalleryControlProps ) {
	const [ images, setImages ] = useState< number[] >( [] );

	useEffect( () => {
		if ( value.length === 0 ) {
			setImages( [] );
		} else if ( typeof value[ 0 ] === 'object' && value[ 0 ] !== null ) {
			setImages( value.map( ( val ) => ( val as ImageDetails ).id ) );
		} else {
			setImages( value as number[] );
		}
	}, [ value ] );

	const hasImages = images.length !== 0;

	const imagesSelected = ( selectedImages: MediaItem[] ) => {
		if ( onSelect ) {
			onSelect(
				selectedImages.map( ( image ) => getImageDetails( image, size ) ),
				selectedImages,
			);
		}
	};

	const removeImages = () => {
		if ( onSelect ) {
			onSelect( [], [] );
		}
	};

	return (
		<BaseControl
			help={ help }
			label={ label }
			className="gumponents-gallery-control"
		>
			<MediaUpload
				multiple
				gallery
				onSelect={ imagesSelected }
				value={ hasImages ? images : undefined }
				allowedTypes={ [ 'image' ] }
				render={ ( { open }: { open: () => void } ) => (
					<Button
						isDefault
						className="gumponents-gallery-control__select"
						onClick={ open }
					>
						{ hasImages ? updateLabel : selectLabel }
					</Button>
				) }
			/>
			{ hasImages && (
				<>
					<div className="gumponents-gallery-control__total">
						<strong>{ images.length }</strong> { __( 'images selected' ) }
					</div>
					<Button onClick={ removeImages } isLink isDestructive>
						{ removeLabel }
					</Button>
				</>
			) }
		</BaseControl>
	);
}
