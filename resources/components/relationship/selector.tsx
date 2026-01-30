import { __ } from '@wordpress/i18n';
import { useState, useEffect, useRef } from '@wordpress/element';
import SearchItems from './search-items';
import SelectedItems from './selected-items';
import type { RelationshipItem } from '../../types';

const TYPING_DELAY = 300;

interface SelectorProps {
	maxItems: number;
	onSelect: ( items: RelationshipItem[] ) => void;
	items: RelationshipItem[];
	searchQuery: ( query?: string ) => Promise< RelationshipItem[] >;
}

export default function Selector( { maxItems, onSelect, items, searchQuery }: SelectorProps ) {
	const [ results, setResults ] = useState< RelationshipItem[] >( [] );
	const [ searching, setSearching ] = useState( false );
	const typingDelayTimeout = useRef< ReturnType< typeof setTimeout > | null >( null );

	useEffect( () => {
		triggerSearch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] );

	const triggerTyping = ( e: React.ChangeEvent< HTMLInputElement > ) => {
		if ( typingDelayTimeout.current ) {
			clearTimeout( typingDelayTimeout.current );
		}
		typingDelayTimeout.current = setTimeout( triggerSearch, TYPING_DELAY, e.target.value );
	};

	const triggerSearch = ( query?: string ) => {
		setSearching( true );
		searchQuery( query ).then( ( newResults ) => {
			setSearching( false );
			setResults( newResults );
		} );
	};

	return (
		<div className="gumponent-relationship">
			<div className="gumponent-relationship__search-container">
				<input
					type="text"
					className="gumponent-relationship__search"
					placeholder={ __( 'Search' ) }
					onChange={ triggerTyping }
				/>
			</div>
			<div className="gumponent-relationship__panel">
				<div className="gumponent-relationship__panel__search-items">
					<SearchItems
						disabled={ maxItems > 0 && items.length >= maxItems }
						items={ results }
						loading={ searching }
						selected={ items }
						onSelected={ ( item ) => onSelect( [ ...items, item ] ) }
					/>
				</div>
				<div className="gumponent-relationship__panel__selected-items">
					<SelectedItems
						items={ items }
						onUpdated={ ( newItems ) => onSelect( newItems ) }
						onUnselected={ ( item ) => onSelect( items.filter( ( thing ) => thing.value !== item.value ) ) }
					/>
				</div>
			</div>
		</div>
	);
}
