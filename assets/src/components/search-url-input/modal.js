import wp from 'wp';
import isEmpty from 'lodash/isEmpty';
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
	useEffect,
	useCallback,
} = wp.element;

export function SearchUrlModal( { className = '', onRequestClose, title, value, postTypes, onChange, onUrl } ) {
	const [ url, setUrl ] = useState( '' );
	const [ text, setText ] = useState( '' );
	const [ newWindow, setNewWindow ] = useState( false );
	const [ searchTerm, setSearchTerm ] = useState( '' );
	const [ suggestions, setSuggestions ] = useState( [] );
	const [ showSuggestions, setShowSuggestions ] = useState( false );
	const [ loading, setLoading ] = useState( false );
	const [ error, setError ] = useState( null );

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
						post_types: postTypes,
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
		setUrl( value );
		debouncedSearch( value );
	};

	// Handle manual URL input
	const handleUrlChange = ( newUrl ) => {
		setUrl( newUrl );
		setSearchTerm( newUrl );
		setShowSuggestions( false );

		const changes = {
			url: newUrl,
			text: text || newUrl,
			newWindow,
		};

		if ( onUrl ) {
			onUrl( newUrl, null );
		}

		onChange( changes );
	};

	// Handle suggestion selection
	const handleSuggestionSelect = ( suggestion ) => {
		const newUrl = suggestion.url;
		const newText = text || suggestion.title;

		setUrl( newUrl );
		setText( newText );
		setSearchTerm( newUrl );
		setShowSuggestions( false );

		const changes = {
			url: newUrl,
			text: newText,
			newWindow,
		};

		if ( onUrl ) {
			onUrl( newUrl, suggestion );
		}

		onChange( changes );
	};

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
				{ showSuggestions && suggestions.length > 0 && (
					<div className="gumponents-search-url-input__suggestions">
						{ suggestions.map( ( suggestion ) => (
							<button
								key={ suggestion.id }
								type="button"
								className="gumponents-search-url-input__suggestion"
								onClick={ () => handleSuggestionSelect( suggestion ) }
							>
								<div className="gumponents-search-url-input__suggestion-title">
									{ suggestion.title }
								</div>
								<div className="gumponents-search-url-input__suggestion-meta">
									{ suggestion.type === 'post' && __( 'Post' ) }
									{ suggestion.type === 'page' && __( 'Page' ) }
									{ suggestion.subtype && ` • ${ suggestion.subtype }` }
								</div>
								<div className="gumponents-search-url-input__suggestion-url">
									{ suggestion.url }
								</div>
							</button>
						) ) }
					</div>
				) }
				{ showSuggestions && suggestions.length === 0 && ! loading && searchTerm.length >= 3 && (
					<div className="gumponents-search-url-input__no-results">
						{ __( 'No results found. You can still enter the URL manually.' ) }
					</div>
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
