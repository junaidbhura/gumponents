import wp from 'wp';
import React from 'react';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';

const {
	Spinner,
} = wp.components;

class SearchItems extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			loading: false,
			items: [],
			selected: [],
			disabled: false,
		};

		if ( this.props.loading ) {
			this.state.loading = this.props.loading;
		}
		if ( this.props.selected ) {
			this.state.selected = this.props.selected;
		}
		if ( this.props.selected ) {
			this.state.selected = this.props.selected;
		}
		if ( this.props.disabled ) {
			this.state.disabled = this.props.disabled;
		}
	}

	componentDidUpdate( prevProps ) {
		const newState = {};

		if ( prevProps.loading !== this.props.loading ) {
			newState.loading = this.props.loading;
		}
		if ( prevProps.items !== this.props.items ) {
			newState.items = this.props.items;
		}
		if ( prevProps.selected !== this.props.selected ) {
			newState.selected = this.props.selected;
		}
		if ( prevProps.disabled !== this.props.disabled ) {
			newState.disabled = this.props.disabled;
		}

		if ( ! isEmpty( newState ) ) {
			this.setState( newState );
		}
	}

	render() {
		const {
			loading,
			items,
			selected,
			disabled,
		} = this.state;

		return (
			<ul className={ classnames( 'gumponent-relationship__items', ( loading ? 'gumponent-relationship__items--loading' : null ), ( disabled ? 'gumponent-relationship__items--disabled' : null ) ) }>
				{ loading &&
					<Spinner />
				}
				{
					items.map( item => {
						const itemAlreadySelected = selected.find( ( sel ) => sel.id === item.id );
						return (
							<li
								className={ classnames( 'gumponent-relationship__items__item', itemAlreadySelected ? 'gumponent-relationship__items__item--selected' : null ) }
							>
								<a
									href="#"
									onClick={ ( e ) => {
										e.preventDefault();
										if ( ! itemAlreadySelected ) {
											this.props.onSelected( item );
										}
									} }
								>{ item.label }</a>
							</li>
						);
					} )
				}
			</ul>
		);
	}
}

export default SearchItems;
