/**
 * Data Store.
 */

import wp from 'wp';
import unionWith from 'lodash/unionWith';
import isEqual from 'lodash/isEqual';

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
		getMedia( state, id ) {
			return new Promise( ( resolve ) => {
				const cached = state.media.find( ( item ) => item.id === id );
				if ( cached ) {
					resolve( cached );
				} else {
					apiFetch( {
						path: `/gumponents/media/v1/get?id=${ id }`,
					} )
						.then( ( media ) => resolve( media ) );
				}
			} );
		},
	},
} );
