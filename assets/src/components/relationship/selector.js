import React from 'react';

import SearchItems from './search-items';
import SelectedItems from './selected-items';

const typingDelay = 300;

class Selector extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			search: '',
			results: [],
			selected: [],
			searching: false,
		};

		this.typingDelayTimeout = null;
	}

	componentDidMount() {
		if ( '' === this.state.search && 0 === this.state.results.length ) {
			this.triggerSearch();
		}
		if ( this.props.selected !== this.state.selected ) {
			this.setState( {
				selected: this.props.selected,
			} );
		}
	}

	componentDidUpdate( prevProps, prevState ) {
		if ( prevState.selected !== this.state.selected ) {
			this.props.onSelect( this.state.selected );
		}
	}

	triggerTyping() {
		clearTimeout( this.typingDelayTimeout );
		this.typingDelayTimeout = setTimeout( () => {
			this.triggerSearch();
		}, typingDelay );
	}

	triggerSearch() {
		if ( this.props.searchQuery ) {
			this.setState( { searching: true } );
			this.props.searchQuery( this.state.search ).then( ( results ) => {
				this.setState( {
					searching: false,
					results,
				} );
			} );
		}
	}

	render() {
		const {
			search,
			results,
			selected,
			searching,
		} = this.state;

		const { maxItems, filterControl } = this.props;

		return (
			<div className="gumponent-relationship">
				<div className="gumponent-relationship__search-container">
					<div className="gumponent-relationship__search">
						<input
							type="text"
							className="gumponent-relationship__search-input"
							placeholder="Search"
							value={ search }
							onChange={ ( e ) => {
								this.setState( {
									search: e.target.value,
								} );
								this.triggerTyping();
							} }
						/>
					</div>
					{ filterControl &&
						<div className="gumponent-relationship__filter">
							{ filterControl }
						</div>
					}
				</div>
				<div className="gumponent-relationship__panel">
					<div className="gumponent-relationship__panel__search-items">
						<SearchItems
							disabled={ maxItems > 0 && selected.length >= maxItems }
							items={ results }
							loading={ searching }
							selected={ selected }
							onSelected={ ( item ) => {
								this.setState( ( prevState ) => {
									return {
										selected: [ ...prevState.selected, item ],
									};
								} );
							} }
						/>
					</div>
					<div className="gumponent-relationship__panel__selected-items">
						<SelectedItems
							items={ selected }
							onUpdated={ ( selected ) => this.setState( { selected } ) }
							onUnselected={ ( item ) => this.setState( ( prevState ) => {
								return {
									selected: prevState.selected.filter( ( thing ) => thing.value !== item.value ),
								};
							} ) }
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default Selector;
