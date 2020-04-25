import './editor.scss';

import wp from 'wp';
import isEmpty from 'lodash/isEmpty';

const { __ } = wp.i18n;
const {
	BaseControl,
	Icon,
} = wp.components;
const { URLInput } = wp.blockEditor;
const {
	Modal,
	Button,
	TextControl,
	ToggleControl,
} = wp.components;
const {
	useState,
	useEffect,
} = wp.element;

export default function LinkControl( { value, label, help, onUrl, onChange, buttonLabel = __( 'Select link' ), modalTitle = __( 'URL' ) } ) {
	const [ modalOpen, setModalOpen ] = useState( false );
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
		<BaseControl
			label={ label }
			help={ help }
			className="gumponents-link-control"
		>
			<Button
				isDefault
				onClick={ () => setModalOpen( true ) }
			>
				{ buttonLabel }
			</Button>
			{ ! isEmpty( value ) && '' !== url &&
				<div className="gumponents-link-control__preview">
					<a
						href={ url }
						target="_blank"
						rel="noopener noreferrer"
					>
						{ '' === text && url }
						{ text }
						{ false !== newWindow &&
							<Icon
								icon="external"
								size={ 15 }
							/>
						}
					</a>
				</div>
			}
			{ modalOpen &&
				<Modal
					title={ modalTitle }
					shouldCloseOnClickOutside={ false }
					className="gumponents-link-control__modal"
					onRequestClose={ () => setModalOpen( false ) }
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

								onChange( changes );
							} }
						/>
					</BaseControl>
					<TextControl
						label={ __( 'Link Text' ) }
						value={ text }
						onChange={ ( text ) => onChange( { url, text, newWindow } ) }
					/>
					<ToggleControl
						label={ __( 'New Tab' ) }
						help={ __( 'Open link in a new tab?' ) }
						checked={ newWindow }
						onChange={ () => onChange( { url, text, newWindow: ! newWindow } ) }
					/>
				</Modal>
			}
		</BaseControl>
	);
}
