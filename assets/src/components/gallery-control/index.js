import './editor.scss';

import wp from 'wp';
import isObject from 'lodash/isObject';
import { getImageDetails } from '../image-control';

const { __ } = wp.i18n;
const {
	Button,
	BaseControl,
} = wp.components;
const {
	MediaUpload,
} = wp.blockEditor;
const {
	Fragment,
	useState,
	useEffect,
} = wp.element;

export default function GalleryControl( { value = [], size = 'full', help, onSelect, label = __( 'Select images' ), selectLabel = __( 'Select images' ), updateLabel = __( 'Update images' ), removeLabel = __( 'Remove images' ) } ) {
	const [ images, setImages ] = useState( [] );

	useEffect(
		() => {
			if ( 0 === value.length ) {
				setImages( [] );
			} else if ( isObject( value[ 0 ] ) ) {
				setImages( value.map( ( val ) => val.id ) );
			} else {
				setImages( value );
			}
		},
		[ value ]
	);

	const hasImages = 0 !== images.length;

	const imagesSelected = ( selectedImages ) => {
		if ( onSelect ) {
			onSelect( selectedImages.map( ( image ) => getImageDetails( image, size ) ), selectedImages );
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
				value={ hasImages ? images : null }
				allowedTypes={ [ 'image' ] }
				render={ ( { open } ) => (
					<Button
						isDefault
						className="gumponents-gallery-control__select"
						onClick={ open }
					>
						{ hasImages ? updateLabel : selectLabel }
					</Button>
				) }
			/>
			{ hasImages &&
				<Fragment>
					<div className="gumponents-gallery-control__total">
						<strong>{ images.length }</strong> { __( 'images selected' ) }
					</div>
					<Button onClick={ removeImages } isLink isDestructive>
						{ removeLabel }
					</Button>
				</Fragment>
			}
		</BaseControl>
	);
}
