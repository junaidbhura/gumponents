import wp from 'wp';
import Relationship from '../relationship';

const { apiFetch } = wp;
const {
	withSelect,
} = wp.data;
const { compose } = wp.compose;

function RelationshipControl( props ) {
	const { searchApiUrl, searchApiData = {}, searchApiMethod = 'post', onSetItems } = props;
	return (
		<Relationship
			{ ...props }
			searchQuery={ ( query ) => {
				console.log( { query, searchApiUrl, searchApiMethod }, {
							...searchApiData,
							query,
						} );
				return new Promise( ( resolve ) => {
					apiFetch( {
						path: `${ searchApiUrl }?query=${ query }`,
						method: searchApiMethod,
					} ).then( ( results ) => resolve( results ) );
				} );
			} }
			onSetItems={ onSetItems }
		/>
	);
}

export default compose(
	withSelect( ( select, ownProps ) => {
		return {
			initialItems: select( 'gumponents/relationship' ).getItems( ownProps.value ),
		};
	} ),
)( RelationshipControl );
