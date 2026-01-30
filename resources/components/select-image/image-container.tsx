import { __ } from '@wordpress/i18n';
import { Button, Placeholder } from '@wordpress/components';
import { RichText } from '@wordpress/block-editor';
import type { ImageDetails } from '../../types';

interface ImageContainerProps {
	image?: ImageDetails | null;
	open: () => void;
	placeholder?: string;
	showCaption?: boolean;
	onRemove: () => void;
	onEdit: () => void;
	onCaptionEdit: ( image: ImageDetails ) => void;
}

export default function ImageContainer( {
	image,
	open,
	placeholder,
	showCaption,
	onRemove,
	onEdit,
	onCaptionEdit,
}: ImageContainerProps ) {
	const isEmpty = ! image || ! image.id;

	return (
		<span className="gumponents-select-image__container">
			{ isEmpty && (
				<Placeholder
					label={ placeholder }
					icon="format-image"
				>
					<Button
						onClick={ open }
						className="gumponents-select-image__button"
					/>
				</Placeholder>
			) }
			{ ! isEmpty && (
				<figure className="gumponents-select-image__image-container">
					<div className="gumponents-select-image__inline-menu">
						<Button
							icon="edit"
							onClick={ onEdit }
							className="gumponents-select-image__inline-menu__edit"
							label={ __( 'Edit Image' ) }
						/>
						<Button
							icon="no-alt"
							onClick={ onRemove }
							className="gumponents-select-image__inline-menu__remove"
							label={ __( 'Remove Image' ) }
						/>
					</div>
					<a href="#" onClick={ open } className="gumponents-select-image__img-container">
						<img src={ image!.src } alt="" className="gumponents-select-image__img" />
					</a>
					{ image && showCaption && (
						<figcaption className="gumponents-select-image__caption">
							<RichText
								value={ image.caption }
								onChange={ ( caption: string ) => onCaptionEdit( { ...image, caption } ) }
								placeholder={ __( 'Caption...', 'gumponents' ) }
								multiline={ false }
								allowedFormats={ [] }
								keepPlaceholderOnFocus={ true }
							/>
						</figcaption>
					) }
				</figure>
			) }
		</span>
	);
}
