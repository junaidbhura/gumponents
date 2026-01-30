import { __ } from '@wordpress/i18n';
import { Spinner, Icon } from '@wordpress/components';
import classnames from 'classnames';
import type { RelationshipItem } from '../../types';

interface SearchItemsProps {
	disabled: boolean;
	items: RelationshipItem[];
	loading: boolean;
	selected: RelationshipItem[];
	onSelected: ( item: RelationshipItem ) => void;
}

export default function SearchItems( { disabled, items, loading, selected, onSelected }: SearchItemsProps ) {
	return (
		<ul
			className={ classnames( 'gumponent-relationship__items', 'gumponent-relationship__items--search', {
				'gumponent-relationship__items--loading': loading,
				'gumponent-relationship__items--disabled': disabled,
			} ) }
		>
			{ loading && <Spinner /> }
			{ items.map( ( item ) => {
				const itemSelected = selected.find( ( sel ) => sel.id === item.id );
				return (
					<li // eslint-disable-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
						key={ item.id }
						className={ classnames( 'gumponent-relationship__item', {
							'gumponent-relationship__item--selected': itemSelected,
						} ) }
						onClick={ () => {
							if ( ! itemSelected ) {
								onSelected( item );
							}
						} }
					>
						<div className="gumponent-relationship__item-label">
							{ item.label !== '' ? item.label : __( '(no title)' ) }
						</div>
						<div className="gumponent-relationship__item-action">
							<Icon icon="arrow-right-alt2" />
						</div>
					</li>
				);
			} ) }
		</ul>
	);
}
