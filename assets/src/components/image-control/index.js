import './editor.scss';

import wp from 'wp';
import React from 'react';
import has from 'lodash/has';

const {
	withSelect,
	withDispatch,
} = wp.data;

const { __ } = wp.i18n;

const {
	Button,
	Spinner,
	BaseControl,
	ResponsiveWrapper,
} = wp.components;

const {
	MediaUpload,
} = wp.editor;

class ImageControl extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			id: null,
			media: null,
		};
	}

	componentDidMount() {
		if ( this.props.value ) {
			this.setState( {
				id: this.props.value,
			} );
			this.props.getMedia.then( media => {
				this.setState( {
					media,
				} );
				this.props.onSetMedia( media );
			} );
		}
	}

	componentDidUpdate( prevProps, prevState ) {
		if ( prevProps.media !== this.props.media ) {
			this.setState( {
				media: this.props.media,
			} );
		}
	}

	getImageDetails( media ) {
		if ( ! media ) {
			return {};
		}

		let size = 'full';
		let src, width, height;

		if ( this.props.size ) {
			size = this.props.size;
		}

		if ( has( media, 'sizes' ) ) {
			if ( ! has( media.sizes, size ) ) {
				size = 'full';
			}
			width = media.sizes[ size ].width;
			height = media.sizes[ size ].height;
			src = media.sizes[ size ].url;
		}

		return {
			id: media.id,
			src,
			width,
			height,
			alt: media.alt,
			size,
		};
	}

	render() {
		const { id, media } = this.state;
		let { label, help, selectLabel, removeLabel } = this.props;
		const imageDetails = this.getImageDetails( media );

		if ( ! selectLabel ) {
			selectLabel = __( 'Select image' );
		}
		if ( ! removeLabel ) {
			removeLabel = __( 'Remove image' );
		}

		const onSelectImage = ( media ) => {
			this.setState( {
				id: media.id,
				media,
			} );

			this.props.onSetMedia( media );

			if ( this.props.onChange ) {
				this.props.onChange( this.getImageDetails( media ), media );
			}
		};

		const onRemoveImage = () => {
			this.setState( {
				id: null,
				media: null,
			} );

			if ( this.props.onChange ) {
				this.props.onChange( null, null );
			}
		};

		return (
			<BaseControl
				label={ label }
				help={ help }
				className="gumponents-image-control"
			>
				{ id &&
					<div className="gumponents-image-control__preview">
						{ ! media &&
							<Spinner />
						}
						{ media &&
							<MediaUpload
								title={ selectLabel }
								onSelect={ media => onSelectImage( media ) }
								type="image"
								value={ id }
								render={ ( { open } ) => (
									<Button className="gumponents-image-control__preview" onClick={ open }>
										{ media &&
											<ResponsiveWrapper
												naturalWidth={ imageDetails.width }
												naturalHeight={ imageDetails.height }
											>
												<img src={ imageDetails.src } />
											</ResponsiveWrapper>
										}
									</Button>
								) }
							/>
						}
					</div>
				}
				{ media &&
					<Button onClick={ onRemoveImage } isLink isDestructive>
						{ removeLabel }
					</Button>
				}
				{ ! media &&
					<MediaUpload
						title={ selectLabel }
						onSelect={ media => onSelectImage( media ) }
						type="image"
						render={ ( { open } ) => (
							<Button
								isDefault
								className="gumponents-image-control__select"
								onClick={ open }
							>
								{ selectLabel }
							</Button>
						) }
					/>
				}
			</BaseControl>
		);
	}

}

export default withSelect( ( select, ownProps ) => {
	const { getMedia } = select( 'gumponents/media' );
	const { value } = ownProps;

	return {
		getMedia: value ? getMedia( value ) : null,
	};
} )( withDispatch( ( dispatch, ownProps ) => {
	return {
		onSetMedia( media ) {
			dispatch( 'gumponents/media' ).setMedia( media );
		},
	};
} )( ImageControl ) );
