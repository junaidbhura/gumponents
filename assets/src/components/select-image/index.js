import './editor.scss';

import wp from 'wp';
import React from 'react';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import has from 'lodash/has';

import ImageContainer from './image-container';

const { __ } = wp.i18n;

const {
	MediaUpload,
} = wp.editor;

const {
	Modal,
	TextControl,
	TextareaControl,
} = wp.components;

class SelectImage extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			image: {},
			media: {},
			modalOpen: false,
		};
	}

	componentDidMount() {
		if ( this.props.image ) {
			this.setState( {
				image: this.props.image,
			} );
		}
	}

	componentDidUpdate( prevProps, prevState ) {
		if ( prevState.image !== this.state.image && this.props.onChange ) {
			this.props.onChange( this.state.image, this.state.media );
		}
		if ( prevState.media !== this.state.media && this.props.onMedia ) {
			this.props.onMedia( this.state.media );
		}
	}

	updateImage( newImg ) {
		this.setState( { image: newImg } );
		if ( this.props.onChange ) {
			this.props.onChange( newImg, this.state.media );
		}
	}

	render() {
		const { image, modalOpen } = this.state;

		const {
			className,
			placeholder,
			showCaption,
		} = this.props;

		let {
			size,
		} = this.props;

		if ( 'undefined' === typeof size ) {
			size = 'thumbnail';
		}

		return (
			<div className={ classnames(
				'gumponents-select-image',
				className,
				! isEmpty( image ) ? 'gumponents-select-image--selected' : null,
				! placeholder ? 'gumponents-select-image--no-placeholder' : null
			) }>
				<MediaUpload
					onSelect={ ( media ) => {
						if ( ! media ) {
							this.setState( {
								image: {},
								media: {},
							} );
							return;
						}

						if ( ! has( media.sizes, size ) ) {
							size = 'full';
						}

						this.setState( {
							image: {
								id: media.id,
								src: media.sizes[ size ].url,
								width: media.sizes[ size ].width,
								height: media.sizes[ size ].height,
								alt: media.alt,
								caption: media.caption,
								title: media.title,
								size: size,
							},
							media,
						} );
					} }
					type="image"
					value={ image.id }
					render={ ( { open } ) => (
						<ImageContainer
							placeholder={ placeholder }
							image={ image }
							open={ open }
							showCaption={ showCaption }
							onRemove={ () => this.setState( { image: {}, media: {} } ) }
							onEdit={ () => this.setState( { modalOpen: true } ) }
							onCaptionEdit={ ( newImg ) => this.updateImage( newImg ) }
						/>
					) }
				/>
				{ modalOpen &&
					<Modal
						title={ __( 'Edit Image', 'gumponents' ) }
						className="gumponents-select-image__modal"
						onRequestClose={ () => this.setState( { modalOpen: false } ) }>
						<TextControl
							label={ __( 'Alt Text', 'gumponents' ) }
							value={ image.alt }
							onChange={ ( alt ) => {
								let newImg = image;
								newImg.alt = alt;
								this.updateImage( newImg );
							} }
						/>
						<TextareaControl
							label={ __( 'Caption', 'gumponents' ) }
							value={ image.caption }
							onChange={ ( caption ) => {
								let newImg = image;
								newImg.caption = caption;
								this.updateImage( newImg );
							} }
						/>
						<TextControl
							label={ __( 'Title', 'gumponents' ) }
							value={ image.title }
							onChange={ ( title ) => {
								let newImg = image;
								newImg.title = title;
								this.updateImage( newImg );
							} }
						/>
					</Modal>
				}
			</div>
		);
	}
}

export default SelectImage;
