import wp from 'wp';

const { __ } = wp.i18n;
const {
	BaseControl,
} = wp.components;
const {
	Modal,
	TextControl,
	ToggleControl,
} = wp.components;
const {
	useState,
} = wp.element;

export function SearchUrlModal( { className = '', onRequestClose, title, value, onChange, onUrl } ) {
	const [ url, setUrl ] = useState( '' );
	const [ text, setText ] = useState( '' );
	const [ newWindow, setNewWindow ] = useState( false );
	const [ searchTerm, setSearchTerm ] = useState( '' );

	// Handle search input change
	const handleSearchChange = ( value ) => {};

	// Handle manual URL input
	const handleUrlChange = ( newUrl ) => {};

	return (
		<Modal
			title={ title }
			shouldCloseOnClickOutside={ false }
			className={ className }
			onRequestClose={ onRequestClose }
		>
			<BaseControl
				label={ __( 'Search or enter URL' ) }
				help={ __( 'Start typing to search for posts and pages, or enter a full URL' ) }
				className="gumponents-search-url-input__search"
			>
				<div className="gumponents-search-url-input__search-wrapper">
					<TextControl
						value={ searchTerm }
						onChange={ handleSearchChange }
						placeholder={ __( 'Search posts, pages, or enter URL...' ) }
						className="gumponents-search-url-input__search-input"
					/>
				</div>
			</BaseControl>
			<TextControl
				label={ __( 'URL' ) }
				help={ __( 'Final URL that will be used for the link' ) }
				value={ url }
				onChange={ handleUrlChange }
			/>
			<TextControl
				label={ __( 'Link Text' ) }
				value={ text }
				onChange={ ( newText ) => {
					setText( newText );
					onChange( { url, text: newText, newWindow } );
				} }
			/>
			<ToggleControl
				label={ __( 'New Tab' ) }
				help={ __( 'Open link in a new tab?' ) }
				checked={ newWindow }
				onChange={ () => {
					const newWindowValue = ! newWindow;
					setNewWindow( newWindowValue );
					onChange( { url, text, newWindow: newWindowValue } );
				} }
			/>
		</Modal>
	);
}
