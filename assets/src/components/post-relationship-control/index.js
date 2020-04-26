import wp from 'wp';
import Relationship from '../relationship';

const { apiFetch } = wp;
const {
	withSelect,
	withDispatch,
} = wp.data;
const { compose } = wp.compose;

function PostRelationshipControl( props ) {
	const { postTypes, taxonomies, filter } = props;
	return (
		<Relationship
			{ ...props }
			searchQuery={ ( query ) => {
				return new Promise( ( resolve ) => {
					apiFetch( {
						path: '/gumponents/relationship/v1/posts/query',
						data: {
							post_types: postTypes,
							post_taxonomies: taxonomies,
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
			initialItems: select( 'gumponents/relationship' ).getPosts( ownProps.value ),
		};
	} ),
	withDispatch( ( dispatch ) => {
		return {
			onSetItems( items ) {
				dispatch( 'gumponents/relationship' ).setPosts( items );
			},
		};
	} ),
)( PostRelationshipControl );
