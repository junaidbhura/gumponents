import { __ } from '@wordpress/i18n';
import { BaseControl, Modal, TextControl, ToggleControl } from '@wordpress/components';
import { URLInput } from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';

export interface LinkValue {
	url: string;
	text: string;
	newWindow: boolean;
}

interface UrlModalProps {
	className?: string;
	onRequestClose: () => void;
	title: string;
	value?: LinkValue | null;
	onChange: ( value: LinkValue ) => void;
	onUrl?: ( url: string, post: { title: string } | null ) => void;
}

export function UrlModal( {
	className = '',
	onRequestClose,
	title,
	value,
	onChange,
	onUrl,
}: UrlModalProps ) {
	const [ url, setUrl ] = useState( '' );
	const [ text, setText ] = useState( '' );
	const [ newWindow, setNewWindow ] = useState( false );

	useEffect( () => {
		if ( value ) {
			setUrl( value.url );
			setText( value.text );
			setNewWindow( value.newWindow );
		}
	}, [ value ] );

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
					onChange={ ( newUrl: string, post?: { title: string } ) => {
						if ( onUrl ) {
							onUrl( newUrl, post ?? null );
						}

						const changes: LinkValue = {
							url: newUrl,
							text,
							newWindow,
						};
						if ( post && text === '' ) {
							changes.text = post.title;
						} else if ( newUrl === '' ) {
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
				onChange={ ( newText: string ) => {
					setText( newText );
					onChange( { url, text: newText, newWindow } );
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
