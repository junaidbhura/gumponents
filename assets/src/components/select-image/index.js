import './editor.scss';

import wp from 'wp';
import React from 'react';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import has from 'lodash/has';

import ImageContainer from './image-container';

const {
	MediaUpload,
} = wp.editor;

class SelectImage extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			image: {},
			media: {},
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
			this.props.onChange( this.state.image );
		}
		if ( prevState.media !== this.state.media && this.props.onMedia ) {
			this.props.onMedia( this.state.media );
		}
	}

	render() {
		const { image } = this.state;

		const {
			className,
			placeholder,
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
							onRemove={ () => this.setState( { image: {}, media: {} } ) }
						/>
					) }
				/>
			</div>
		);
	}
}

export default SelectImage;
