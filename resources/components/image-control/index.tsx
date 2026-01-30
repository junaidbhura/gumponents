import './editor.scss';

import { __ } from '@wordpress/i18n';
import { Button, Spinner, BaseControl, ResponsiveWrapper } from '@wordpress/components';
import { MediaUpload } from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import classnames from 'classnames';
import type { ImageDetails, MediaItem } from '../../types';

/**
 * Get formatted image details from a media object.
 */
export function getImageDetails( media: MediaItem, thumbnailSize: string = 'full' ): ImageDetails {
	if ( ! media ) {
		return {} as ImageDetails;
	}

	let src: string | undefined;
	let width: number | undefined;
	let height: number | undefined;
	let size = thumbnailSize;

	if ( 'sizes' in media && media.sizes ) {
		if ( ! ( size in media.sizes ) ) {
			size = 'full';
		}
		width = media.sizes[ size ].width;
		height = media.sizes[ size ].height;
		src = media.sizes[ size ].url;
	}

	return {
		id: media.id,
		src: src ?? '',
		width: width ?? 0,
		height: height ?? 0,
		alt: media.alt,
		caption: media.caption,
		title: media.title,
		size,
	};
}

interface ImageControlProps {
	label?: string;
	help?: string;
	value?: number | ImageDetails | null;
	size?: string;
	selectLabel?: string;
	removeLabel?: string;
	onChange?: ( image: ImageDetails | null, media: MediaItem | null ) => void;
}

export default function ImageControl( {
	label,
	help,
	value,
	size = 'full',
	selectLabel = __( 'Select image' ),
	removeLabel = __( 'Remove image' ),
	onChange,
}: ImageControlProps ) {
	const [ id, setId ] = useState< number | null >( null );
	const [ controlValue, setControlValue ] = useState< ImageDetails | null >( null );

	const selectedMedia = useSelect(
		( select ) => {
			const { getMedia } = select( 'gumponents/media' );
			return value ? getMedia( value ) : null;
		},
		[ value ],
	);

	const { setMedia: onSetMedia } = useDispatch( 'gumponents/media' );

	useEffect( () => {
		if ( typeof value !== 'object' || value === null ) {
			setId( value as number | null );
			setControlValue( null );
		} else {
			setId( value.id );
			setControlValue( value );
		}
	}, [ value ] );

	useEffect( () => {
		if ( typeof selectedMedia === 'object' && selectedMedia !== null ) {
			setId( selectedMedia.id );
			setControlValue( getImageDetails( selectedMedia as MediaItem, size ) );
		}
	}, [ selectedMedia, size ] );

	const onSelectImage = ( media: MediaItem ) => {
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
				'gumponents-image-control--selected': controlValue !== null,
			} ) }
		>
			{ id && (
				<div className="gumponents-image-control__preview">
					{ ! controlValue && <Spinner /> }
					{ controlValue && (
						<MediaUpload
							title={ selectLabel }
							onSelect={ ( media: MediaItem ) => onSelectImage( media ) }
							type="image"
							value={ id }
							render={ ( { open }: { open: () => void } ) => (
								<>
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
								</>
							) }
						/>
					) }
				</div>
			) }
			{ controlValue && (
				<Button onClick={ onRemoveImage } isLink isDestructive>
					{ removeLabel }
				</Button>
			) }
			{ ! controlValue && ! id && (
				<MediaUpload
					title={ selectLabel }
					onSelect={ ( media: MediaItem ) => onSelectImage( media ) }
					allowedTypes={ [ 'image' ] }
					render={ ( { open }: { open: () => void } ) => (
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
			) }
		</BaseControl>
	);
}
