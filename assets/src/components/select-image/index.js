import './editor.scss';

import wp from 'wp';
import React from 'react';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import ImageContainer from './image-container';

const {
	MediaUpload,
} = wp.editor;

class SelectImage extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			image: {},
		};
	}

	componentDidMount() {
		if ( this.props.image ) {
			this.setState( {
				image: JSON.parse( this.props.image ),
			} );
		}
	}

	componentDidUpdate( prevProps, prevState ) {
		if ( prevState.image !== this.state.image && this.props.onChange ) {
			this.props.onChange( JSON.stringify( this.state.image ) );
		}
	}

	render() {
		const { image } = this.state;

		let {
			className,
			size,
			placeholder,
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
					onSelect={ media => {
						if ( ! media ) {
							this.setState( {
								image: {},
							} );
							return;
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
						} );
					} }
					type="image"
					value={ image.id }
					render={ ( { open } ) => (
						<ImageContainer
							placeholder={ placeholder }
							image={ image }
							open={ open }
							onRemove={ () => this.setState( { image: {} } ) }
						/>
					) }
				/>
			</div>
		);
	}

}

export default SelectImage;
