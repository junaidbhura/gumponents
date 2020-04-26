import wp from 'wp';
import SearchItems from './search-items';
import SelectedItems from './selected-items';

const { __ } = wp.i18n;
const {
	useState,
	useEffect,
} = wp.element;

const typingDelay = 300;
let typingDelayTimeout = null;

export default function Selector( { maxItems, onSelect, items, searchQuery } ) {
	const [ results, setResults ] = useState( [] );
	const [ searching, setSearching ] = useState( false );

	useEffect( () => triggerSearch(), [] );

	const triggerTyping = ( e ) => {
		clearTimeout( typingDelayTimeout );
		typingDelayTimeout = setTimeout( triggerSearch, typingDelay, e.target.value );
	};

	const triggerSearch = ( query ) => {
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
						onSelected={ ( item ) => onSelect( Array.prototype.concat( items, [ item ] ) ) }
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
