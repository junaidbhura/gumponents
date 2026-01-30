import { __ } from '@wordpress/i18n';
import { Tooltip, Button } from '@wordpress/components';
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
	arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { RelationshipItem } from '../../types';

interface SortableItemProps {
	item: RelationshipItem;
	onUnselected: ( item: RelationshipItem ) => void;
}

function SortableItem( { item, onUnselected }: SortableItemProps ) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
	} = useSortable( { id: `id-${ item.id }` } );

	const style = {
		transform: CSS.Transform.toString( transform ),
		transition: transition ?? undefined,
	};

	return (
		<li
			className="gumponent-relationship__item"
			ref={ setNodeRef }
			style={ style }
			{ ...attributes }
			{ ...listeners }
		>
			<div className="gumponent-relationship__item-label">
				{ item.label !== '' ? item.label : __( '(no title)' ) }
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
	);
}

interface SelectedItemsProps {
	items: RelationshipItem[];
	onUpdated: ( items: RelationshipItem[] ) => void;
	onUnselected: ( item: RelationshipItem ) => void;
}

export default function SelectedItems( { items, onUpdated, onUnselected }: SelectedItemsProps ) {
	const sensors = useSensors(
		useSensor( PointerSensor ),
		useSensor( KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		} ),
	);

	const onDragEnd = ( event: DragEndEvent ) => {
		const { active, over } = event;
		if ( ! over || active.id === over.id ) {
			return;
		}
		const oldIndex = items.findIndex( ( item ) => `id-${ item.id }` === active.id );
		const newIndex = items.findIndex( ( item ) => `id-${ item.id }` === over.id );
		onUpdated( arrayMove( items, oldIndex, newIndex ) );
	};

	const sortableIds = items.map( ( item ) => `id-${ item.id }` );

	return (
		<DndContext
			sensors={ sensors }
			collisionDetection={ closestCenter }
			onDragEnd={ onDragEnd }
		>
			<SortableContext
				items={ sortableIds }
				strategy={ verticalListSortingStrategy }
			>
				<ul className="gumponent-relationship__items">
					{ items.map( ( item ) => (
						<SortableItem
							key={ item.id }
							item={ item }
							onUnselected={ onUnselected }
						/>
					) ) }
				</ul>
			</SortableContext>
		</DndContext>
	);
}
