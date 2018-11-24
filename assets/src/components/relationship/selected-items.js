import wp from 'wp';
import React from 'react';
import classnames from 'classnames';

import {
	DragDropContext,
	Droppable,
	Draggable,
} from 'react-beautiful-dnd';

const {
	Spinner,
} = wp.components;

class SelectedItems extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			loading: false,
			items: [],
		};

		if ( this.props.items ) {
			this.state.items = this.props.items;
		}

		this.onDragEnd = this.onDragEnd.bind( this );
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.items !== this.props.items ) {
			this.setState( {
				items: this.props.items,
			} );
		}
	}

	onDragEnd( result ) {
		if ( ! result.destination ) {
			return;
		}

		const newItems    = Array.from( this.state.items );
		const [ removed ] = newItems.splice( result.source.index, 1 );
		newItems.splice( result.destination.index, 0, removed );

		this.setState( {
			items: newItems,
		} );

		this.props.onUpdated( newItems );
	}

	render() {
		const {
			loading,
			items,
		} = this.state;

		return (
			<DragDropContext onDragEnd={ this.onDragEnd }>
				<Droppable droppableId="selected-items">
					{ provided => (
						<ul
							className={ classnames( 'gumponent-relationship__items', ( loading ? 'gumponent-relationship__items--loading' : null ) ) }
							ref={ provided.innerRef }
						>
							{ loading &&
								<Spinner />
							}
							{
								items.map( ( item, index ) => {
									return (
										<Draggable draggableId={ item.id } index={ index }>
											{ provided => (
												<li
													className="gumponent-relationship__items__item"
													ref={ provided.innerRef }
													{ ...provided.draggableProps }
													{ ...provided.dragHandleProps }
												>
													<a
														href="#"
														onClick={ e => {
															e.preventDefault();
															this.props.onUnselected( item );
														} }
													>
														{ item.label }
													</a>
												</li>
											) }
										</Draggable>
									);
								} )
							}
							{ provided.placeholder }
						</ul>
					) }
				</Droppable>
			</DragDropContext>
		);
	}

}

export default SelectedItems;
