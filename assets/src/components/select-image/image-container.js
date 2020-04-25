import wp from 'wp';
import React from 'react';
import isEmpty from 'lodash/isEmpty';

const {
	Button,
	Placeholder,
	IconButton,
} = wp.components;

const {
	RichText,
} = wp.blockEditor;

const { __ } = wp.i18n;

class ImageContainer extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			image: {},
		};
	}

	componentDidMount() {
		if ( this.props.image && ! isEmpty( this.props.image ) ) {
			this.setState( {
				image: this.props.image,
			} );
		}
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.image !== this.props.image ) {
			this.setState( {
				image: this.props.image,
			} );
		}
	}

	render() {
		const { image } = this.state;
		const { open, placeholder, showCaption, onRemove, onEdit, onCaptionEdit } = this.props;

		return (
			<span className="gumponents-select-image__container">
				{ isEmpty( image ) &&
					<Placeholder
						label={ placeholder }
						icon="format-image">
						<Button
							onClick={ open }
							className="gumponents-select-image__button"
						/>
					</Placeholder>
				}
				{ ! isEmpty( image ) &&
					<figure className="gumponents-select-image__image-container">
						<div className="gumponents-select-image__inline-menu">
							<IconButton
								icon="edit"
								onClick={ onEdit }
								className="gumponents-select-image__inline-menu__edit"
								label={ __( 'Edit Image' ) }
							/>
							<IconButton
								icon="no-alt"
								onClick={ onRemove }
								className="gumponents-select-image__inline-menu__remove"
								label={ __( 'Remove Image' ) }
							/>
						</div>
						<a href="#" onClick={ open }>
							<img src={ image.src } alt="" className="gumponents-select-image__img" />
						</a>
						{ ! isEmpty( image ) && showCaption &&
							<figcaption className="gumponents-select-image__caption">
								<RichText
									value={ image.caption }
									onChange={ ( caption ) => {
										let updatedImage = image;
										updatedImage.caption = caption;
										this.setState( { image: updatedImage } );
										onCaptionEdit( updatedImage );
									} }
									placeholder={ __( 'Caption...', 'gumponents' ) }
									multiline={ false }
									formattingControls={ [] }
								/>
							</figcaption>
						}
					</figure>
				}
			</span>
		);
	}
}

export default ImageContainer;
