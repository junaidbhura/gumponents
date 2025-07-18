import wp from 'wp';
import { SearchUrlModal } from './modal';

const { __ } = wp.i18n;
const {
	BaseControl,
} = wp.components;
const {
	Button,
} = wp.components;
const {
	useState,
} = wp.element;

export default function SearchURLInput( { value, label, help, onUrl, onChange, buttonLabel = __( 'Select URL' ), modalTitle = __( 'Search & Select URL' ) } ) {
	const [ modalOpen, setModalOpen ] = useState( false );

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
			{ modalOpen &&
				<SearchUrlModal
					className="gumponents-search-url-input"
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
