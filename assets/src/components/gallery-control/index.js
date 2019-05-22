import './editor.scss';

import React from 'react';
import wp from 'wp';
import has from 'lodash/has';
import isObject from 'lodash/isObject';
import isNumber from 'lodash/isNumber';

const {
	Button,
	BaseControl,
} = wp.components;

const {
	MediaUpload,
} = wp.editor;

const { __ } = wp.i18n;

class GalleryControl extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			size: 'thumbnail',
			images: [],
			media: [],
		};

		this.imagesSelected = this.imagesSelected.bind( this );
		this.removeImages = this.removeImages.bind( this );
		this.getImageIds = this.getImageIds.bind( this );
	}

	componentDidMount() {
		if ( this.props.size ) {
			this.setState( {
				size: this.props.size,
			} );
		}
		if ( this.props.value ) {
			this.setState( {
				images: this.props.value,
			} );
		}
	}

	componentDidUpdate( prevProps, prevState ) {
		if ( this.props.onSelect && prevState.images !== this.state.images ) {
			this.props.onSelect( this.state.images, this.state.media );
		}
	}

	render() {
		const { help } = this.props;
		let { label, selectLabel, updateLabel, removeLabel } = this.props;
		const hasImages = !! this.state.images.length;
		const imageIds = this.getImageIds();

		if ( ! label ) {
			label = __( 'Select images' );
		}
		if ( ! selectLabel ) {
			selectLabel = __( 'Select images' );
		}
		if ( ! updateLabel ) {
			updateLabel = __( 'Update images' );
		}
		if ( ! removeLabel ) {
			removeLabel = __( 'Remove images' );
		}

		return (
			<BaseControl
				help={ help }
				label={ label }
				className="gumponents-gallery-control"
			>
				<MediaUpload
					multiple
					gallery
					onSelect={ this.imagesSelected }
					value={ hasImages ? imageIds : undefined }
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
					<div className="gumponents-gallery-control__total">
						<strong>{ imageIds.length }</strong> { __( 'selected' ) }
					</div>
				}
				{ hasImages &&
					<Button onClick={ this.removeImages } isLink isDestructive>
						{ removeLabel }
					</Button>
				}
			</BaseControl>
		);
	}

	imagesSelected( selectedImages ) {
		const images = [];
		const media = [];

		selectedImages.map( ( image ) => { // eslint-disable-line
			let imageDetails;
			let size;

			if ( has( image.sizes, this.state.size ) ) {
				imageDetails = image.sizes[ this.state.size ];
				size = this.state.size;
			} else {
				imageDetails = image.sizes.full;
				size = 'full';
			}

			images.push( {
				id: image.id,
				src: imageDetails.url,
				width: imageDetails.width,
				height: imageDetails.height,
				alt: image.alt,
				caption: image.caption,
				title: image.title,
				size,
				fullUrl: image.url,
			} );

			media.push( image );
		} );

		this.setState( {
			images,
			media,
		} );
	}

	removeImages() {
		this.setState( {
			images: [],
			media: [],
		} );
	}

	getImageIds() {
		if ( 0 === this.state.images.length ) {
			return [];
		}

		if ( isObject( this.state.images[ 0 ] ) ) {
			return this.state.images.map( ( image ) => image.id );
		} else if ( isNumber( this.state.images[ 0 ] ) ) {
			return this.state.images;
		}

		return [];
	}
}

export default GalleryControl;
