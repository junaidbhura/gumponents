import wp from 'wp';
import isEmpty from 'lodash/isEmpty';

const {
	Button,
	Placeholder,
} = wp.components;
const { RichText } = wp.blockEditor;
const { __ } = wp.i18n;

export default function ImageContainer( { image, open, placeholder, showCaption, onRemove, onEdit, onCaptionEdit } ) {
	return (
		<span className="gumponents-select-image__container">
			{ isEmpty( image ) &&
				<Placeholder
					label={ placeholder }
					icon="format-image">
					<Button
						onClick={ open }
						className="gumponents-select-image__button"
					/>
				</Placeholder>
			}
			{ ! isEmpty( image ) &&
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
						<img src={ image.src } alt="" className="gumponents-select-image__img" />
					</a>
					{ ! isEmpty( image ) && showCaption &&
						<figcaption className="gumponents-select-image__caption">
							<RichText
								value={ image.caption }
								onChange={ ( caption ) => onCaptionEdit( { ...image, caption } ) }
								placeholder={ __( 'Caption...', 'gumponents' ) }
								multiline={ false }
								allowedFormats={ [] }
								keepPlaceholderOnFocus={ true }
							/>
						</figcaption>
					}
				</figure>
			}
		</span>
	);
}
