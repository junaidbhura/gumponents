import './editor.scss';

import wp from 'wp';
import has from 'lodash/has';
import isObject from 'lodash/isObject';
import classnames from 'classnames';

const { Fragment } = wp.element;
const {
	withSelect,
	withDispatch,
} = wp.data;
const {
	useState,
	useEffect,
} = wp.element;
const { __ } = wp.i18n;
const {
	Button,
	Spinner,
	BaseControl,
	ResponsiveWrapper,
} = wp.components;
const { MediaUpload } = wp.blockEditor;
const { compose } = wp.compose;

/**
 * Get formatted image details from a media object.
 *
 * @param {Object} media Media object.
 * @param {string} thumbnailSize Thumbnail size.
 * @return {Object} Formatted image details.
 */
export function getImageDetails( media, thumbnailSize = 'full' ) {
	if ( ! media ) {
		return {};
	}

	let src, width, height;

	if ( has( media, 'sizes' ) ) {
		if ( ! has( media.sizes, thumbnailSize ) ) {
			thumbnailSize = 'full';
		}
		width = media.sizes[ thumbnailSize ].width;
		height = media.sizes[ thumbnailSize ].height;
		src = media.sizes[ thumbnailSize ].url;
	}

	return {
		id: media.id,
		src,
		width,
		height,
		alt: media.alt,
		caption: media.caption,
		title: media.title,
		size: thumbnailSize,
	};
}

function ImageControl( { label, help, value, size, selectLabel = __( 'Select image' ), removeLabel = __( 'Remove image' ), onChange, onSetMedia, selectedMedia } ) {
	const [ id, setId ] = useState( null );
	const [ controlValue, setControlValue ] = useState( null );

	useEffect(
		() => {
			if ( ! isObject( value ) ) {
				setId( value );
				setControlValue( null );
			} else {
				setId( value.id );
				setControlValue( value );
			}
		},
		[ value ]
	);

	useEffect(
		() => {
			if ( isObject( selectedMedia ) ) {
				setId( selectedMedia.id );
				setControlValue( getImageDetails( selectedMedia, size ) );
			}
		},
		[ selectedMedia ]
	);

	const onSelectImage = ( media ) => {
		const image = getImageDetails( media, size );

		setId( image.id );
		setControlValue( image );

		onSetMedia( media );

		if ( onChange ) {
			onChange( image, media );
		}
	};

	const onRemoveImage = () => {
		setId( null );
		setControlValue( null );

		if ( onChange ) {
			onChange( null, null );
		}
	};

	return (
		<BaseControl
			label={ label }
			help={ help }
			className={ classnames( 'gumponents-image-control', {
				'gumponents-image-control--selected': null !== controlValue,
			} ) }
		>
			{ id &&
				<div className="gumponents-image-control__preview">
					{ ! controlValue &&
						<Spinner />
					}
					{ controlValue &&
						<MediaUpload
							title={ selectLabel }
							onSelect={ ( media ) => onSelectImage( media ) }
							type="image"
							value={ id }
							render={ ( { open } ) => (
								<Fragment>
									<Button className="gumponents-image-control__preview" onClick={ open }>
										<ResponsiveWrapper
											naturalWidth={ controlValue.width }
											naturalHeight={ controlValue.height }
										>
											<img src={ controlValue.src } alt="" />
										</ResponsiveWrapper>
									</Button>
									<Button onClick={ open } isSecondary>
										{ __( 'Replace Image' ) }
									</Button>
								</Fragment>
							) }
						/>
					}
				</div>
			}
			{ controlValue &&
				<Button onClick={ onRemoveImage } isLink isDestructive>
					{ removeLabel }
				</Button>
			}
			{ ! controlValue && ! id &&
				<MediaUpload
					title={ selectLabel }
					onSelect={ ( media ) => onSelectImage( media ) }
					allowedTypes={ [ 'image' ] }
					render={ ( { open } ) => (
						<div className="editor-post-featured-image__container">
							<Button
								onClick={ open }
								className="editor-post-featured-image__toggle"
							>
								{ selectLabel }
							</Button>
						</div>
					) }
				/>
			}
		</BaseControl>
	);
}

export default compose(
	withSelect( ( select, ownProps ) => {
		const { getMedia } = select( 'gumponents/media' );
		const { value } = ownProps;

		return {
			selectedMedia: value ? getMedia( value ) : null,
		};
	} ),
	withDispatch( ( dispatch ) => {
		return {
			onSetMedia( media ) {
				dispatch( 'gumponents/media' ).setMedia( media );
			},
		};
	} ),
)( ImageControl );
