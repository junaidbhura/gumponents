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

	getPostTypes() {
		return {
			type: 'GET_POST_TYPES',
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
			return state.postTypes;
		},
	},

	controls: {
		GET_POST_TYPES() {
			return apiFetch( {
				path: `/gumponents/core/v1/get_post_types`,
			} );
		},
	},

	resolvers: {
		* getPostTypes() {
			const postTypes = yield actions.getPostTypes();
			return actions.setPostTypes( postTypes );
		},
	},
} );
