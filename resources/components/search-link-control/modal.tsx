import { __ } from '@wordpress/i18n';
import {
	BaseControl,
	Modal,
	TextControl,
	ToggleControl,
	Spinner,
	Notice,
} from '@wordpress/components';
import { useState, useEffect, useCallback } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import MultiSelectControl from '../multiselect-control';
import type { LinkValue } from '../link-control/modal';

interface Suggestion {
	id: number;
	title: string;
	url: string;
	type: string;
	subtype: string;
}

interface SearchLinkModalProps {
	className?: string;
	onRequestClose: () => void;
	title: string;
	value?: LinkValue | null;
	postTypes: string | string[];
	hidePostTypesControl?: boolean;
	onChange: ( value: LinkValue ) => void;
	onUrl?: ( url: string, suggestion: Suggestion | null ) => void;
}

interface PostTypeData {
	viewable: boolean;
	slug: string;
	name: string;
	labels?: { name?: string };
}

interface QueryResponse {
	id: number;
	label: string;
	permalink: string;
	value: { post_type: string };
}

function debounce< T extends ( ...args: any[] ) => void >( fn: T, ms: number ): T {
	let timer: ReturnType< typeof setTimeout >;
	return ( ( ...args: Parameters< T > ) => {
		clearTimeout( timer );
		timer = setTimeout( () => fn( ...args ), ms );
	} ) as unknown as T;
}

export function SearchLinkModal( {
	className = '',
	onRequestClose,
	title,
	value,
	postTypes,
	hidePostTypesControl = false,
	onChange,
	onUrl,
}: SearchLinkModalProps ) {
	const [ url, setUrl ] = useState( '' );
	const [ text, setText ] = useState( '' );
	const [ newWindow, setNewWindow ] = useState( false );
	const [ searchTerm, setSearchTerm ] = useState( '' );
	const [ suggestions, setSuggestions ] = useState< Suggestion[] >( [] );
	const [ selectedPostTypes, setSelectedPostTypes ] = useState< string[] >(
		Array.isArray( postTypes ) ? postTypes : [ postTypes ].filter( Boolean ),
	);
	const [ showSuggestions, setShowSuggestions ] = useState( false );
	const [ loading, setLoading ] = useState( false );
	const [ error, setError ] = useState< string | null >( null );

	useEffect( () => {
		if ( value ) {
			setUrl( value.url );
			setText( value.text );
			setNewWindow( value.newWindow );
		}
	}, [ value ] );

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedSearch = useCallback(
		debounce( async ( term: string ) => {
			if ( term.length < 3 ) {
				setSuggestions( [] );
				setShowSuggestions( false );
				return;
			}

			setLoading( true );
			setError( null );

			try {
				const response = await apiFetch< QueryResponse[] >( {
					path: '/gumponents/relationship/v1/posts/query',
					method: 'POST',
					data: {
						search: term,
						post_types: selectedPostTypes.length > 0 ? selectedPostTypes : postTypes,
						post_status: [ 'publish' ],
					},
				} );

				const formattedSuggestions: Suggestion[] = response.map( ( item ) => ( {
					id: item.id,
					title: item.label,
					url: item.permalink,
					type: item.value.post_type,
					subtype: item.value.post_type,
				} ) );

				setSuggestions( formattedSuggestions );
				setShowSuggestions( true );
			} catch {
				setError( __( 'Error loading suggestions. Please try again.' ) );
			}

			setLoading( false );
		}, 300 ),
		[ selectedPostTypes ],
	);

	const handleSearchChange = ( newValue: string ) => {
		setSearchTerm( newValue );
		setUrl( newValue );
		debouncedSearch( newValue );
	};

	const handleUrlChange = ( newUrl: string ) => {
		setUrl( newUrl );
		setSearchTerm( newUrl );
		setShowSuggestions( false );

		const changes: LinkValue = {
			url: newUrl,
			text: text || newUrl,
			newWindow,
		};

		if ( onUrl ) {
			onUrl( newUrl, null );
		}

		onChange( changes );
	};

	const handleSuggestionSelect = ( suggestion: Suggestion ) => {
		const newUrl = suggestion.url;
		const newText = text || suggestion.title;

		setUrl( newUrl );
		setText( newText );
		setSearchTerm( '' );
		setShowSuggestions( false );

		const changes: LinkValue = {
			url: newUrl,
			text: newText,
			newWindow,
		};

		if ( onUrl ) {
			onUrl( newUrl, suggestion );
		}

		onChange( changes );
	};

	const allPostTypes: Array< { name: string; slug: string } > = useSelect( ( sel ) => {
		const postTypesData = sel( 'core' ).getPostTypes( { per_page: -1 } ) as PostTypeData[] | null;
		if ( ! postTypesData ) {
			return [];
		}

		return postTypesData
			.filter( ( postType ) => postType.viewable && postType.slug !== 'attachment' )
			.map( ( postType ) => ( {
				name: postType.labels?.name || postType.name,
				slug: postType.slug,
			} ) );
	}, [] );

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
									{ suggestion.subtype && ` \u2022 ${ suggestion.subtype }` }
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
				onChange={ ( newText: string ) => {
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
