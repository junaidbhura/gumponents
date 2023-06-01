import wp from 'wp';
import Relationship from '../relationship';

const { apiFetch } = wp;
const {
	withSelect,
	withDispatch,
} = wp.data;
const { compose } = wp.compose;

function RelationshipControl( props ) {
	const { searchApiPath = '' } = props;
	return (
		<Relationship
			{ ...props }
			searchQuery={ ( query ) => {
				return new Promise( ( resolve ) => {
					apiFetch( {
						path: searchApiPath,
						method: 'post',
						data: {
							query,
						},
					} ).then( ( results ) => resolve( results ) );
				} );
			} }
		/>
	);
}

export default compose(
	withSelect( ( select, ownProps ) => {
		const { value = [], getItemsApiPath = '' } = ownProps;
		return {
			initialItems: select( 'gumponents/relationship' ).getItems( value, getItemsApiPath ),
		};
	} ),
	withDispatch( ( dispatch ) => {
		return {
			onSetItems( items ) {
				dispatch( 'gumponents/relationship' ).setItems( items );
			},
		};
	} ),
)( RelationshipControl );
