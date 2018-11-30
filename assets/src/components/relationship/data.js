/**
 * Data Store.
 */

import unionWith from 'lodash/unionWith';
import isEqual from 'lodash/isEqual';

const { registerStore } = wp.data;

const DEFAULT_STATE = {
	posts: [],
};

const { apiFetch } = wp;

const actions = {

	setPosts( posts ) {
		return {
			type: 'SET_POSTS',
			items: posts,
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
		}
		return state;
	},

	actions,

	selectors: {

		getPosts( state, ids ) {
			return new Promise( ( resolve, reject ) => {
				let posts   = [];
				let toFetch = [];
				ids.map( ( id, index ) => {
					let cached = state.posts.find( post => post.id === id );
					if ( cached ) {
						posts[ index ] = cached;
					} else {
						toFetch.push( id );
					}
				} );

				if ( 0 !== toFetch.length ) {
					apiFetch( {
						path: `/gumponents/relationship/v1/initialize`,
						data: {
							type: 'post',
							items: toFetch,
						},
						method: 'post',
					} )
					.then( results => {
						if ( 0 !== results.length ) {
							posts = unionWith( posts, results, isEqual );
						}
						resolve( posts );
					} )
				} else {
					resolve( posts );
				}
			} );
		},

	},
} );
