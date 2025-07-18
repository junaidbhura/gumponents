import wp from 'wp';
import debounce from 'lodash/debounce';

const { __ } = wp.i18n;
const {
	BaseControl,
	Modal,
	TextControl,
	ToggleControl,
	Spinner,
	Notice,
} = wp.components;
const {
	useState,
	useCallback,
} = wp.element;

export function SearchUrlModal( { className = '', onRequestClose, title, value, onChange, onUrl } ) {
	const [ url, setUrl ] = useState( '' );
	const [ text, setText ] = useState( '' );
	const [ newWindow, setNewWindow ] = useState( false );
	const [ searchTerm, setSearchTerm ] = useState( '' );
	const [ suggestions, setSuggestions ] = useState( [] );
	const [ showSuggestions, setShowSuggestions ] = useState( false );
	const [ loading, setLoading ] = useState( false );
	const [ error, setError ] = useState( null );

	// Debounced search function
	const debouncedSearch = useCallback(
		debounce( async ( term ) => {
			if ( term.length < 3 ) {
				setSuggestions( [] );
				setShowSuggestions( false );
				return;
			}

			setLoading( true );
			setError( null );

			try {
				const response = await wp.apiFetch( {
					path: '/gumponents/relationship/v1/posts/query',
					method: 'POST',
					data: {
						search: term,
						post_types: [ 'post', 'page' ], // TODO: Make this dynamic as per component settings.
						post_status: [ 'publish' ],
					},
				} );

				const formattedSuggestions = response.map( ( item ) => ( {
					id: item.id,
					title: item.label,
					url: item.permalink,
					type: item.value.post_type,
					subtype: item.value.post_type,
				} ) );

				setSuggestions( formattedSuggestions );
				setShowSuggestions( true );
			} catch ( err ) {
				setError( __( 'Error loading suggestions. Please try again.' ) );
			}

			setLoading( false );
		}, 300 ),
		[]
	);

	// Handle search input change
	const handleSearchChange = ( value ) => {
		setSearchTerm( value );
		debouncedSearch( value );
	};

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
					{ loading && (
						<div className="gumponents-search-url-input__loading">
							<Spinner />
						</div>
					) }
				</div>
				{ error && (
					<Notice
						status="error"
						isDismissible={ false }
					>
						{ error }
					</Notice>
				) }
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
