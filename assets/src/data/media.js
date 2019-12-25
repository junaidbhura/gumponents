/**
 * Data Store.
 */

import wp from 'wp';
import unionWith from 'lodash/unionWith';
import isEqual from 'lodash/isEqual';
import isObject from 'lodash/isObject';

const { registerStore } = wp.data;

const DEFAULT_STATE = {
	media: [],
};

const { apiFetch } = wp;

const actions = {

	setMedia( media ) {
		return {
			type: 'SET_MEDIA',
			media,
		};
	},

	getMedia( id ) {
		return {
			type: 'GET_MEDIA',
			id,
		};
	},

};

registerStore( 'gumponents/media', {
	reducer( state = DEFAULT_STATE, action ) {
		switch ( action.type ) {
			case 'SET_MEDIA':
				return {
					...state,
					media: unionWith( state.media, [ action.media ], isEqual ),
				};
		}
		return state;
	},

	actions,

	selectors: {
		getMedia( state, med ) {
			if ( isObject( med ) ) {
				med = med.id;
			}
			const media = state.media.find( ( item ) => item.id === med );
			if ( media ) {
				return media;
			}
			return null;
		},
	},

	controls: {
		GET_MEDIA( { id } ) {
			return apiFetch( {
				path: `/gumponents/media/v1/get?id=${ id }`,
			} );
		},
	},

	resolvers: {
		* getMedia( id ) {
			if ( null === id ) {
				return;
			}
			if ( isObject( id ) ) {
				id = id.id;
			}
			const media = yield actions.getMedia( id );
			return actions.setMedia( media );
		},
	},
} );
