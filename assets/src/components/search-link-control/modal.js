import wp from 'wp';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import MultiSelectControl from '../multiselect-control';

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
const { useSelect } = wp.data;

export function SearchLinkModal( { className = '', onRequestClose, title, value, postTypes, hidePostTypesControl, onChange, onUrl } ) {
	const [ url, setUrl ] = useState( '' );
	const [ text, setText ] = useState( '' );
	const [ newWindow, setNewWindow ] = useState( false );
	const [ searchTerm, setSearchTerm ] = useState( '' );
	const [ suggestions, setSuggestions ] = useState( [] );
	const [ selectedPostTypes, setSelectedPostTypes ] = useState( Array.isArray( postTypes ) ? postTypes : [ postTypes ].filter( Boolean ) );
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
						post_types: selectedPostTypes.length > 0 ? selectedPostTypes : postTypes,
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
		[ selectedPostTypes ]
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
		setSearchTerm( '' ); // Reset search term.
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

	// Fetch all post types.
	const allPostTypes = useSelect( ( select ) => {
		const postTypesData = select( 'core' ).getPostTypes( { per_page: -1 } );
		if ( ! postTypesData ) {
			return [];
		}

		// Extract only name and slug, filter out attachments and non-viewable post types.
		return postTypesData
			.filter( ( postType ) => postType.viewable && postType.slug !== 'attachment' )
			.map( ( postType ) => ( {
				name: postType.labels?.name || postType.name,
				slug: postType.slug,
			} ) );
	}, [] );

	// Create options for MultiSelectControl.
	const postTypeOptions = allPostTypes.map( ( postType ) => ( {
		label: postType.name,
		value: postType.slug,
	} ) );

	return (
		<Modal
			title={ title }
			shouldCloseOnClickOutside={ false }
			className={ className }
			onRequestClose={ onRequestClose }
		>
			{ ! hidePostTypesControl && (
				<MultiSelectControl
					label={ __( 'Post Types' ) }
					placeholder={ __( 'Select post types...' ) }
					value={ selectedPostTypes }
					options={ postTypeOptions }
					onChange={ setSelectedPostTypes }
				/>
			) }
			<BaseControl
				label={ __( 'Search or enter URL' ) }
				help={ __( 'Start typing to search for posts and pages, or enter a full URL' ) }
				className="gumponents-search-link-control__search"
			>
				<div className="gumponents-search-link-control__search-wrapper">
					<TextControl
						value={ searchTerm }
						onChange={ handleSearchChange }
						placeholder={ __( 'Search posts, pages, or enter URL...' ) }
						className="gumponents-search-link-control__search-input"
					/>
					{ loading && (
						<div className="gumponents-search-link-control__loading">
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
					<div className="gumponents-search-link-control__suggestions">
						{ suggestions.map( ( suggestion ) => (
							<button
								key={ suggestion.id }
								type="button"
								className="gumponents-search-link-control__suggestion"
								onClick={ () => handleSuggestionSelect( suggestion ) }
							>
								<div className="gumponents-search-link-control__suggestion-title">
									{ suggestion.title }
								</div>
								<div className="gumponents-search-link-control__suggestion-meta">
									{ suggestion.type === 'post' && __( 'Post' ) }
									{ suggestion.type === 'page' && __( 'Page' ) }
									{ suggestion.subtype && ` • ${ suggestion.subtype }` }
								</div>
								<div className="gumponents-search-link-control__suggestion-url">
									{ suggestion.url }
								</div>
							</button>
						) ) }
					</div>
				) }
				{ showSuggestions && suggestions.length === 0 && ! loading && searchTerm.length >= 3 && (
					<div className="gumponents-search-link-control__no-results">
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
