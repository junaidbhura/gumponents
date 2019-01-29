import './editor.scss';

import wp from 'wp';
import React from 'react';
import has from 'lodash/has';

const {
	withSelect,
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
			id: 0,
			media: null,
			loading: false,
			initialized: false,
		};
	}

	componentDidMount() {
		if ( this.props.value ) {
			if ( this.props.media ) {
				this.setState( {
					id: this.props.media.id,
					media: this.props.media,
					loading: false,
					initialized: true,
				} );
			} else {
				this.setState( {
					id: this.props.value,
					loading: true,
				} );
			}
		}
	}

	componentDidUpdate( prevProps, prevState ) {
		if ( prevState.media !== this.state.media ) {
			if ( this.props.onSelect ) {
				this.props.onSelect( this.getImageDetails( this.state.media ), this.state.media );
			}
		}
		if ( ! this.state.initialized && prevProps.media !== this.props.media ) {
			this.setState( {
				media: this.props.media,
				loading: false,
				initialized: true,
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

		if ( has( media, 'media_details' ) ) {
			if ( has( media, [ 'media_details', 'sizes', size ] ) ) {
				width = media.media_details.sizes[ size ].width;
				height = media.media_details.sizes[ size ].height;
				src = media.media_details.sizes[ size ].source_url;
			} else {
				width = media.media_details.width;
				height = media.media_details.height;
				src = media.source_url;
			}
		} else if ( has( media, 'sizes' ) ) {
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
		const { id, loading, media } = this.state;
		let { help, selectLabel, removeLabel } = this.props;

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
				initialized: true,
			} );
		};

		const onRemoveImage = () => {
			this.setState( {
				id: 0,
				media: null,
				initialized: true,
			} );
		};

		let mediaWidth, mediaHeight, mediaSourceUrl;
		if ( media ) {
			let mediaSize = 'thumbnail';
			if ( has( media, 'media_details' ) ) {
				if ( has( media, [ 'media_details', 'sizes', mediaSize ] ) ) {
					mediaWidth = media.media_details.sizes[ mediaSize ].width;
					mediaHeight = media.media_details.sizes[ mediaSize ].height;
					mediaSourceUrl = media.media_details.sizes[ mediaSize ].source_url;
				} else {
					mediaWidth = media.media_details.width;
					mediaHeight = media.media_details.height;
					mediaSourceUrl = media.source_url;
				}
			} else if ( has( media, 'sizes' ) ) {
				if ( ! has( media.sizes, mediaSize ) ) {
					mediaSize = 'full';
				}
				mediaWidth = media.sizes[ mediaSize ].width;
				mediaHeight = media.sizes[ mediaSize ].height;
				mediaSourceUrl = media.sizes[ mediaSize ].url;
			}
		}

		return (
			<BaseControl
				help={ help }
				className="gumponents-image-control"
			>
				<MediaUpload
					title={ selectLabel }
					onSelect={ media => onSelectImage( media ) }
					type="image"
					value={ 0 !== id ? id : null }
					render={ ( { open } ) => (
						<Button className="gumponents-image-control__preview" onClick={ open }>
							{ media &&
								<ResponsiveWrapper
									naturalWidth={ mediaWidth }
									naturalHeight={ mediaHeight }
								>
									<img src={ mediaSourceUrl } />
								</ResponsiveWrapper>
							}
							{ loading && <Spinner /> }
						</Button>
					) }
				/>
				{ media && ! loading &&
					<Button onClick={ onRemoveImage } isLink isDestructive>
						{ removeLabel }
					</Button>
				}
				{ ! media && ! loading &&
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
	const { getMedia } = select( 'core' );
	const { value }    = ownProps;
	return {
		media: value ? getMedia( value ) : null,
	};
} )( ImageControl );
