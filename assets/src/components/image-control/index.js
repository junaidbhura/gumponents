import './editor.scss';

import wp from 'wp';
import has from 'lodash/has';
import isObject from 'lodash/isObject';
import classnames from 'classnames';

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

const {
	MediaUpload,
} = wp.editor;

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
				setId( value.id );
				setControlValue( value );
			}
		},
		[ selectedMedia ]
	);

	const getImageDetails = ( media ) => {
		if ( ! media ) {
			return {};
		}

		let mediaSize = 'full';
		let src, width, height;

		if ( size ) {
			mediaSize = size;
		}

		if ( has( media, 'sizes' ) ) {
			if ( ! has( media.sizes, mediaSize ) ) {
				mediaSize = 'full';
			}
			width = media.sizes[ mediaSize ].width;
			height = media.sizes[ mediaSize ].height;
			src = media.sizes[ mediaSize ].url;
		}

		return {
			id: media.id,
			src,
			width,
			height,
			alt: media.alt,
			caption: media.caption,
			title: media.title,
			size: mediaSize,
		};
	};

	const onSelectImage = ( media ) => {
		const image = getImageDetails( media );

		setId( null );
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
								<Button className="gumponents-image-control__preview" onClick={ open }>
									<ResponsiveWrapper
										naturalWidth={ controlValue.width }
										naturalHeight={ controlValue.height }
									>
										<img src={ controlValue.src } alt="" />
									</ResponsiveWrapper>
								</Button>
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
			{ ! controlValue &&
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

export default withSelect( ( select, ownProps ) => {
	const { getMedia } = select( 'gumponents/media' );
	const { value } = ownProps;

	return {
		selectedMedia: value ? getMedia( value ) : null,
	};
} )( withDispatch( ( dispatch ) => {
	return {
		onSetMedia( media ) {
			dispatch( 'gumponents/media' ).setMedia( media );
		},
	};
} )( ImageControl ) );
