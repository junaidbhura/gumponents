import wp from 'wp';
import isEmpty from 'lodash/isEmpty';

import './editor.scss';
import { SearchUrlModal } from './modal';

const { __ } = wp.i18n;
const {
	BaseControl,
	Button,
	Icon,
} = wp.components;
const {
	useState,
} = wp.element;

export default function SearchURLInput( { value, label, help, postTypes = [ 'post', 'page' ], hidePostTypesControl = false, onUrl, onChange, buttonLabel = __( 'Select URL' ), modalTitle = __( 'Search & Select URL' ) } ) {
	const [ modalOpen, setModalOpen ] = useState( false );
	const { url, text, newWindow } = value ?? {};

	return (
		<BaseControl
			label={ label }
			help={ help }
			className="gumponents-search-url-input"
		>
			<Button
				isDefault
				onClick={ () => setModalOpen( true ) }
			>
				{ buttonLabel }
			</Button>
			{ ! isEmpty( value ) && '' !== url &&
				<div className="gumponents-search-url-input__preview">
					<a
						href={ url }
						target="_blank"
						rel="noopener noreferrer"
						className="gumponents-search-url-input__preview-link"
					>
						{ '' === text && url }
						{ text }
					</a>
					{ false !== newWindow &&
						<Icon
							icon="external"
							size={ 15 }
							className="gumponents-search-url-input__preview-icon"
						/>
					}
				</div>
			}
			{ modalOpen &&
				<SearchUrlModal
					className="gumponents-search-url-input"
					title={ modalTitle }
					onRequestClose={ () => setModalOpen( false ) }
					value={ value }
					hidePostTypesControl={ hidePostTypesControl }
					postTypes={ postTypes }
					onChange={ ( value ) => onChange( value ) }
					onUrl={ onUrl }
				/>
			}
		</BaseControl>
	);
}
