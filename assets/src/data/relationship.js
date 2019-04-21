/**
 * Data Store.
 */

import wp from 'wp';
import unionWith from 'lodash/unionWith';
import isEqual from 'lodash/isEqual';

const { registerStore } = wp.data;

const DEFAULT_STATE = {
	posts: [],
	taxonomies: [],
};

const { apiFetch } = wp;

const actions = {

	setPosts( posts ) {
		return {
			type: 'SET_POSTS',
			items: posts,
		};
	},

	setTaxonomies( taxonomies ) {
		return {
			type: 'SET_TAXONOMIES',
			items: taxonomies,
		};
	},

};

registerStore( 'gumponents/relationship', {
	reducer( state = DEFAULT_STATE, action ) {
		switch ( action.type ) {
			case 'SET_POSTS':
				return {
					...state,
					posts: unionWith( state.posts, action.items, isEqual ),
				};
			case 'SET_TAXONOMIES':
				return {
					...state,
					taxonomies: unionWith( state.taxonomies, action.items, isEqual ),
				};
		}
		return state;
	},

	actions,

	selectors: {

		getPosts( state, ids ) {
			return getItems( state, ids, 'posts' );
		},

		getTaxonomies( state, ids ) {
			return getItems( state, ids, 'taxonomies' );
		},

	},
} );

const getItems = ( state, ids, type ) => {
	let apiPath, hayStack;

	switch ( type ) {
		case 'posts':
			apiPath = '/gumponents/relationship/v1/posts/initialize';
			hayStack = state.posts;
			break;
		case 'taxonomies':
			apiPath = '/gumponents/relationship/v1/taxonomies/initialize';
			hayStack = state.taxonomies;
			break;
		default:
			return [];
	}

	return new Promise( ( resolve ) => {
		let items = [];
		const toFetch = [];
		ids.map( ( id, index ) => { // eslint-disable-line
			const cached = hayStack.find( ( item ) => item.id === id );
			if ( cached ) {
				items[ index ] = cached;
			} else {
				toFetch.push( id );
			}
		} );

		if ( 0 !== toFetch.length ) {
			apiFetch( {
				path: apiPath,
				data: {
					type: 'post',
					items: toFetch,
				},
				method: 'post',
			} )
				.then( ( results ) => {
					if ( 0 !== results.length ) {
						items = unionWith( items, results, isEqual );
					}
					resolve( items );
				} );
		} else {
			resolve( items );
		}
	} );
};
