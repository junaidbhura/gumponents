import './editor.scss';

import wp from 'wp';
import React from 'react';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { getImageDetails } from '../image-control';

import ImageContainer from './image-container';

const { __ } = wp.i18n;
const {
	MediaUpload,
} = wp.blockEditor;
const {
	Modal,
	TextControl,
	TextareaControl,
} = wp.components;
const { useState } = wp.element;

export default function SelectImage( { image, size = 'full', className, placeholder, showCaption, onChange } ) {
	const [ modalOpen, setModalOpen ] = useState( false );

	const imageSelected = ( media ) => {
		if ( onChange ) {
			if ( ! media ) {
				onChange( {} );
			} else {
				onChange( getImageDetails( media, size ) );
			}
		}
	};

	return (
		<div className={ classnames(
			'gumponents-select-image',
			className,
			{
				'gumponents-select-image--selected': ! isEmpty( image ),
				'gumponents-select-image--no-placeholder': ! placeholder,
			}
		) }>
			<MediaUpload
				onSelect={ imageSelected }
				allowedTypes={ [ 'image' ] }
				value={ image ? image.id : null }
				render={ ( { open } ) => (
					<ImageContainer
						placeholder={ placeholder }
						image={ image }
						open={ open }
						showCaption={ showCaption }
						onRemove={ () => onChange( {} ) }
						onEdit={ () => setModalOpen( true ) }
						onCaptionEdit={ ( newImg ) => onChange( newImg ) }
					/>
				) }
			/>
			{ modalOpen &&
				<Modal
					title={ __( 'Edit Image', 'gumponents' ) }
					className="gumponents-select-image__modal"
					onRequestClose={ () => setModalOpen( false ) }>
					<TextControl
						label={ __( 'Alt Text', 'gumponents' ) }
						value={ image.alt }
						onChange={ ( alt ) => onChange( { ...image, alt } ) }
					/>
					<TextareaControl
						label={ __( 'Caption', 'gumponents' ) }
						value={ image.caption }
						onChange={ ( caption ) => onChange( { ...image, caption } ) }
					/>
					<TextControl
						label={ __( 'Title', 'gumponents' ) }
						value={ image.title }
						onChange={ ( title ) => onChange( { ...image, title } ) }
					/>
				</Modal>
			}
		</div>
	);
}
