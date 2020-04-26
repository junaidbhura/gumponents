import wp from 'wp';
import Relationship from '../relationship';

const { apiFetch } = wp;
const {
	withSelect,
	withDispatch,
} = wp.data;
const { compose } = wp.compose;

function TaxonomyRelationshipControl( props ) {
	const { taxonomies, filter } = props;
	return (
		<Relationship
			{ ...props }
			searchQuery={ ( query ) => {
				return new Promise( ( resolve ) => {
					apiFetch( {
						path: '/gumponents/relationship/v1/taxonomies/query',
						data: {
							taxonomies,
							search: query,
							filter,
						},
						method: 'post',
					} ).then( ( results ) => resolve( results ) );
				} );
			} }
		/>
	);
}

export default compose(
	withSelect( ( select, ownProps ) => {
		return {
			initialItems: select( 'gumponents/relationship' ).getTaxonomies( ownProps.value ),
		};
	} ),
	withDispatch( ( dispatch ) => {
		return {
			onSetItems( items ) {
				dispatch( 'gumponents/relationship' ).setTaxonomies( items );
			},
		};
	} ),
)( TaxonomyRelationshipControl );
