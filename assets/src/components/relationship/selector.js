import wp from 'wp';
import React from 'react';

import SearchItems from './search-items';
import SelectedItems from './selected-items';

const {
	apiFetch
} = wp;

const apiPath     = '/gumponents/relationship/v1/query';
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
		const {
			type,
			postTypes,
			postTaxonomies,
			taxonomies,
			filter,
		} = this.props;

		this.setState( {
			searching: true,
		} );

		apiFetch( {
			path: apiPath,
			data: 'post' === type ? {
				'type': 'post',
				'post_types': postTypes,
				'post_taxonomies': postTaxonomies,
				'search': this.state.search,
				'filter': filter,
			} : {
				'type': 'taxonomy',
				'taxonomies': taxonomies,
				'search': this.state.search,
				'filter': filter,
			},
			method: 'post',
		} ).then( results => {
			this.setState( {
				results: results,
				searching: false,
			} )
		} );
	}

	render() {
		const {
			search,
			results,
			selected,
			searching,
		} = this.state;

		return (
			<div className="gumponent-relationship">
				<div className="gumponent-relationship__search-container">
					<input
						type="text"
						className="gumponent-relationship__search"
						placeholder="Search"
						value={ search }
						onChange={ e => {
							this.setState( {
								search: e.target.value,
							} );
							this.triggerTyping();
						} }
					/>
				</div>
				<div className="gumponent-relationship__panel">
					<div className="gumponent-relationship__panel__search-items">
						<SearchItems
							items={ results }
							loading={ searching }
							selected={ selected }
							onSelected={ item => {
								this.setState( prevState => {
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
							onUpdated={ selected => this.setState( { selected } ) }
							onUnselected={ item => this.setState( prevState => {
								return {
									selected: prevState.selected.filter( thing => thing.value !== item.value ),
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
