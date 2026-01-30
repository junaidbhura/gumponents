import './editor.scss';
import { UrlModal } from './modal';
import type { LinkValue } from './modal';

import { __ } from '@wordpress/i18n';
import { BaseControl, Icon, Button } from '@wordpress/components';
import { useState } from '@wordpress/element';

interface LinkControlProps {
	value?: LinkValue | null;
	label?: string;
	help?: string;
	onUrl?: ( url: string, post: { title: string } | null ) => void;
	onChange: ( value: LinkValue ) => void;
	buttonLabel?: string;
	modalTitle?: string;
}

export default function LinkControl( {
	value,
	label,
	help,
	onUrl,
	onChange,
	buttonLabel = __( 'Select link' ),
	modalTitle = __( 'URL' ),
}: LinkControlProps ) {
	const [ modalOpen, setModalOpen ] = useState( false );
	const url = value?.url;
	const text = value?.text;
	const newWindow = value?.newWindow;

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
			{ value && url !== '' && (
				<div className="gumponents-link-control__preview">
					<a
						href={ url }
						target="_blank"
						rel="noopener noreferrer"
					>
						{ text === '' && url }
						{ text }
						{ newWindow !== false && (
							<Icon
								icon="external"
								size={ 15 }
							/>
						) }
					</a>
				</div>
			) }
			{ modalOpen && (
				<UrlModal
					className="gumponents-url-control"
					title={ modalTitle }
					onRequestClose={ () => setModalOpen( false ) }
					value={ value }
					onChange={ ( val ) => onChange( val ) }
					onUrl={ onUrl }
				/>
			) }
		</BaseControl>
	);
}
