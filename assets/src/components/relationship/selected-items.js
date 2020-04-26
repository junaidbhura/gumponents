import wp from 'wp';
import {
	DragDropContext,
	Droppable,
	Draggable,
} from 'react-beautiful-dnd';

const { __ } = wp.i18n;
const {
	Tooltip,
	Button,
} = wp.components;

export default function SelectedItems( { items, onUpdated, onUnselected } ) {
	const onDragEnd = ( result ) => {
		if ( ! result.destination ) {
			return;
		}

		const newItems = Array.from( items );
		const [ removed ] = newItems.splice( result.source.index, 1 );
		newItems.splice( result.destination.index, 0, removed );

		onUpdated( newItems );
	};

	return (
		<DragDropContext onDragEnd={ onDragEnd }>
			<Droppable droppableId="selected-items">
				{ ( provided ) => (
					<ul
						className="gumponent-relationship__items"
						ref={ provided.innerRef }
					>
						{ items.map( ( item, index ) => {
							return (
								<Draggable key={ item.id } draggableId={ `id-${ item.id }` } index={ index }>
									{ ( innerProvided ) => (
										<li
											className="gumponent-relationship__item"
											ref={ innerProvided.innerRef }
											{ ...innerProvided.draggableProps }
											{ ...innerProvided.dragHandleProps }
										>
											<div className="gumponent-relationship__item-label">
												{ '' !== item.label ? item.label : __( '(no title)' ) }
											</div>
											<div className="gumponent-relationship__item-action">
												<Tooltip text={ __( 'Remove' ) }>
													<Button
														onClick={ () => onUnselected( item ) }
														icon="dismiss"
													/>
												</Tooltip>
											</div>
										</li>
									) }
								</Draggable>
							);
						} ) }
						{ provided.placeholder }
					</ul>
				) }
			</Droppable>
		</DragDropContext>
	);
}
