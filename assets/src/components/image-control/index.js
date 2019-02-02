import './editor.scss';

import wp from 'wp';
import React from 'react';
import has from 'lodash/has';
import isObject from 'lodash/isObject';

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
			value: null,
			media: null,
		};
	}

	componentDidMount() {
		if ( this.props.value ) {
			if ( ! isObject( this.props.value ) ) {
				this.setState( {
					id: this.props.value,
				} );
				this.props.getMedia.then( ( media ) => {
					this.setState( {
						id: media.id,
						value: this.getImageDetails( media ),
						media,
					} );
					this.props.onSetMedia( media );
				} );
			} else {
				this.setState( {
					id: this.props.value.id,
					value: this.props.value,
					media: null,
				} );
			}
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
		const { id, value } = this.state;
		const { label, help } = this.props;
		let { selectLabel, removeLabel } = this.props;

		if ( ! selectLabel ) {
			selectLabel = __( 'Select image' );
		}
		if ( ! removeLabel ) {
			removeLabel = __( 'Remove image' );
		}

		const onSelectImage = ( media ) => {
			const value = this.getImageDetails( media );

			this.setState( {
				id: media.id,
				value,
				media,
			} );

			this.props.onSetMedia( media );

			if ( this.props.onChange ) {
				this.props.onChange( value, media );
			}
		};

		const onRemoveImage = () => {
			this.setState( {
				id: null,
				value: null,
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
						{ ! value &&
							<Spinner />
						}
						{ value &&
							<MediaUpload
								title={ selectLabel }
								onSelect={ ( media ) => onSelectImage( media ) }
								type="image"
								value={ id }
								render={ ( { open } ) => (
									<Button className="gumponents-image-control__preview" onClick={ open }>
										<ResponsiveWrapper
											naturalWidth={ value.width }
											naturalHeight={ value.height }
										>
											<img src={ value.src } alt="" />
										</ResponsiveWrapper>
									</Button>
								) }
							/>
						}
					</div>
				}
				{ value &&
					<Button onClick={ onRemoveImage } isLink isDestructive>
						{ removeLabel }
					</Button>
				}
				{ ! value &&
					<MediaUpload
						title={ selectLabel }
						onSelect={ ( media ) => onSelectImage( media ) }
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
} )( withDispatch( ( dispatch ) => {
	return {
		onSetMedia( media ) {
			dispatch( 'gumponents/media' ).setMedia( media );
		},
	};
} )( ImageControl ) );
