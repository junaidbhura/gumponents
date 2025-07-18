import wp from 'wp';

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

export default function SearchURLInput( { value, label, help, buttonLabel = __( 'Select URL' ) } ) {
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
			{ modalOpen && (
				<p>{ __( 'Load the Modal here.') }</p>
			) }
		</BaseControl>
	);
}
