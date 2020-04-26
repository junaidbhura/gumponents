import wp from 'wp';
import classnames from 'classnames';

const { __ } = wp.i18n;
const {
	Spinner,
	Icon,
} = wp.components;

export default function SearchItems( { disabled, items, loading, selected, onSelected } ) {
	return (
		<ul className={ classnames( 'gumponent-relationship__items', 'gumponent-relationship__items--search', {
			'gumponent-relationship__items--loading': loading,
			'gumponent-relationship__items--disabled': disabled,
		} ) }>
			{ loading &&
				<Spinner />
			}
			{ items.map( ( item ) => {
				const itemSelected = selected.find( ( sel ) => sel.id === item.id );
				return (
					<li /* eslint-disable-line */
						key={ item.id }
						className={ classnames( 'gumponent-relationship__item', { 'gumponent-relationship__item--selected': itemSelected } ) }
						onClick={ () => {
							if ( ! itemSelected ) {
								onSelected( item );
							}
						} }
					>
						<div className="gumponent-relationship__item-label">
							{ '' !== item.label ? item.label : __( '(no title)' ) }
						</div>
						<div className="gumponent-relationship__item-action">
							<Icon
								icon="arrow-right-alt2"
							/>
						</div>
					</li>
				);
			} ) }
		</ul>
	);
}
