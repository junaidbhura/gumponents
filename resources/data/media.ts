/**
 * Media data store.
 */

import { createReduxStore, register } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import type { MediaItem } from '../types';

interface MediaState {
	media: MediaItem[];
}

const DEFAULT_STATE: MediaState = {
	media: [],
};

const actions = {
	setMedia( media: MediaItem ) {
		return {
			type: 'SET_MEDIA' as const,
			media,
		};
	},

	getMedia( id: number ) {
		return {
			type: 'GET_MEDIA' as const,
			id,
		};
	},
};

const store = createReduxStore( 'gumponents/media', {
	reducer( state: MediaState = DEFAULT_STATE, action: ReturnType< typeof actions[ keyof typeof actions ] > ) {
		switch ( action.type ) {
			case 'SET_MEDIA':
				if ( state.media.some( ( item ) => item.id === action.media.id ) ) {
					return state;
				}
				return {
					...state,
					media: [ ...state.media, action.media ],
				};
		}
		return state;
	},

	actions,

	selectors: {
		getMedia( state: MediaState, med: number | { id: number } | null ): MediaItem | null {
			if ( med === null ) {
				return null;
			}
			const id = typeof med === 'object' && med !== null ? med.id : med;
			const media = state.media.find( ( item ) => item.id === id );
			return media ?? null;
		},
	},

	controls: {
		GET_MEDIA( { id }: { id: number } ) {
			return apiFetch< MediaItem >( {
				path: `/gumponents/media/v1/get?id=${ id }`,
			} );
		},
	},

	resolvers: {
		*getMedia( id: number | { id: number } | null ) {
			if ( id === null ) {
				return;
			}
			const resolvedId = typeof id === 'object' && id !== null ? id.id : id;
			const media: MediaItem = yield actions.getMedia( resolvedId );
			return actions.setMedia( media );
		},
	},
} );

register( store );
