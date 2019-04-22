/**
 * Data Store.
 */

import wp from 'wp';

const { registerStore } = wp.data;

const DEFAULT_STATE = {
	postTypes: [],
};

const { apiFetch } = wp;

const actions = {

	setPostTypes( postTypes ) {
		return {
			type: 'SET_POST_TYPES',
			postTypes,
		};
	},

};

registerStore( 'gumponents/core', {
	reducer( state = DEFAULT_STATE, action ) {
		switch ( action.type ) {
			case 'SET_POST_TYPES':
				return {
					...state,
					postTypes: action.postTypes,
				};
		}
		return state;
	},

	actions,

	selectors: {
		getPostTypes( state ) {
			return new Promise( ( resolve ) => {
				if ( 0 !== state.postTypes.length ) {
					resolve( state.postTypes );
				} else {
					apiFetch( {
						path: `/gumponents/core/v1/get_post_types`,
					} )
						.then( ( postTypes ) => resolve( postTypes ) );
				}
			} );
		},
	},
} );
