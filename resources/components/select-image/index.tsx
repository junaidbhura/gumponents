import './editor.scss';

import { __ } from '@wordpress/i18n';
import { MediaUpload } from '@wordpress/block-editor';
import { Modal, TextControl, TextareaControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import classnames from 'classnames';
import { getImageDetails } from '../image-control';
import ImageContainer from './image-container';
import type { ImageDetails, MediaItem } from '../../types';

interface SelectImageProps {
	image?: ImageDetails | null;
	size?: string;
	className?: string;
	placeholder?: string;
	showCaption?: boolean;
	onChange?: ( image: ImageDetails ) => void;
}

export default function SelectImage( {
	image,
	size = 'full',
	className,
	placeholder,
	showCaption,
	onChange,
}: SelectImageProps ) {
	const [ modalOpen, setModalOpen ] = useState( false );

	const imageSelected = ( media: MediaItem | null ) => {
		if ( onChange ) {
			if ( ! media ) {
				onChange( {} as ImageDetails );
			} else {
				onChange( getImageDetails( media, size ) );
			}
		}
	};

	const isEmpty = ! image || ! image.id;

	return (
		<div
			className={ classnames(
				'gumponents-select-image',
				className,
				{
					'gumponents-select-image--selected': ! isEmpty,
					'gumponents-select-image--no-placeholder': ! placeholder,
				},
			) }
		>
			<MediaUpload
				onSelect={ imageSelected }
				allowedTypes={ [ 'image' ] }
				value={ image ? image.id : undefined }
				render={ ( { open }: { open: () => void } ) => (
					<ImageContainer
						placeholder={ placeholder }
						image={ image }
						open={ open }
						showCaption={ showCaption }
						onRemove={ () => onChange?.( {} as ImageDetails ) }
						onEdit={ () => setModalOpen( true ) }
						onCaptionEdit={ ( newImg ) => onChange?.( newImg ) }
					/>
				) }
			/>
			{ modalOpen && image && (
				<Modal
					title={ __( 'Edit Image', 'gumponents' ) }
					className="gumponents-select-image__modal"
					onRequestClose={ () => setModalOpen( false ) }
				>
					<TextControl
						label={ __( 'Alt Text', 'gumponents' ) }
						value={ image.alt }
						onChange={ ( alt: string ) => onChange?.( { ...image, alt } ) }
					/>
					<TextareaControl
						label={ __( 'Caption', 'gumponents' ) }
						value={ image.caption }
						onChange={ ( caption: string ) => onChange?.( { ...image, caption } ) }
					/>
					<TextControl
						label={ __( 'Title', 'gumponents' ) }
						value={ image.title }
						onChange={ ( title: string ) => onChange?.( { ...image, title } ) }
					/>
				</Modal>
			) }
		</div>
	);
}
