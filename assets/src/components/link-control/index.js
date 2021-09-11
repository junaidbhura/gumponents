import './editor.scss';
import { UrlModal } from './modal';

import wp from 'wp';
import isEmpty from 'lodash/isEmpty';

const { __ } = wp.i18n;
const {
	BaseControl,
	Icon,
} = wp.components;
const {
	Button,
} = wp.components;
const {
	useState,
} = wp.element;

export default function LinkControl( { value, label, help, onUrl, onChange, buttonLabel = __( 'Select link' ), modalTitle = __( 'URL' ) } ) {
	const [ modalOpen, setModalOpen ] = useState( false );
	const { url, text, newWindow } = value ?? {};

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
				<UrlModal
					className="gumponents-url-control"
					title={ modalTitle }
					onRequestClose={ () => setModalOpen( false ) }
					value={ value }
					onChange={ ( value ) => onChange( value ) }
					onUrl={ onUrl }
				/>
			}
		</BaseControl>
	);
}
