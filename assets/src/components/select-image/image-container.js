import wp from 'wp';
import React from 'react';
import isEmpty from 'lodash/isEmpty';

const {
	Button,
	Placeholder,
	IconButton,
} = wp.components;

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
		const { open, placeholder, onRemove }  = this.props;

		return (
			<span className="select-image__container">
				{ isEmpty( image ) &&
					<Placeholder
						label={ placeholder }
						icon="format-image">
						<Button
							onClick={ open }
							className="select-image__button"
						/>
					</Placeholder>
				}
				{ ! isEmpty( image ) &&
					<div className="select-image__image-container">
						<div className="select-image__inline-menu">
							<IconButton
								icon="no-alt"
								onClick={ onRemove }
								className="select-image__inline-menu__remove"
								label={ __( 'Remove Image' ) }
							/>
						</div>
						<img onClick={ open } src={ image.src } className="select-image__img" />
					</div>
				}
			</span>
		);
	}

}

export default ImageContainer;
