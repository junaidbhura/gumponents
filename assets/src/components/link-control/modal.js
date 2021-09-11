import wp from 'wp';
import isEmpty from 'lodash/isEmpty';

const { __ } = wp.i18n;
const {
	BaseControl,
} = wp.components;
const { URLInput } = wp.blockEditor;
const {
	Modal,
	TextControl,
	ToggleControl,
} = wp.components;
const {
	useState,
	useEffect,
} = wp.element;

export function UrlModal( { className = '', onRequestClose, title, value, onChange, onUrl } ) {
	const [ url, setUrl ] = useState( '' );
	const [ text, setText ] = useState( '' );
	const [ newWindow, setNewWindow ] = useState( false );

	useEffect(
		() => {
			if ( ! isEmpty( value ) ) {
				setUrl( value.url );
				setText( value.text );
				setNewWindow( value.newWindow );
			}
		},
		[ value ]
	);

	return (
		<Modal
			title={ title }
			shouldCloseOnClickOutside={ false }
			className={ className }
			onRequestClose={ onRequestClose }
		>
			<BaseControl
				label={ __( 'URL' ) }
				className="gumponents-url-control"
			>
				<URLInput
					value={ url }
					onChange={ ( newUrl, post ) => {
						if ( onUrl ) {
							onUrl( newUrl, post );
						}

						let changes = {
							url: newUrl,
							text,
							newWindow,
						};
						if ( post && '' === text ) {
							changes.text = post.title;
						} else if ( '' === newUrl ) {
							changes.text = '';
							changes.newWindow = false;
						}

						setUrl( changes.url );
						onChange( changes );
					} }
				/>
			</BaseControl>
			<TextControl
				label={ __( 'Link Text' ) }
				value={ text }
				onChange={ ( text ) => {
					setText( text );
					onChange( { url, text, newWindow } );
				} }
			/>
			<ToggleControl
				label={ __( 'New Tab' ) }
				help={ __( 'Open link in a new tab?' ) }
				checked={ newWindow }
				onChange={ () => onChange( { url, text, newWindow: ! newWindow } ) }
			/>
		</Modal>
	);
}
