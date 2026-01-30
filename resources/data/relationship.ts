/**
 * Relationship data store.
 */

import { createReduxStore, register } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import type { RelationshipItem } from '../types';

interface RelationshipState {
	posts: RelationshipItem[];
	taxonomies: RelationshipItem[];
	items: RelationshipItem[];
}

const DEFAULT_STATE: RelationshipState = {
	posts: [],
	taxonomies: [],
	items: [],
};

function dedup( existing: RelationshipItem[], incoming: RelationshipItem[] ): RelationshipItem[] {
	const newItems = incoming.filter( ( n ) => ! existing.some( ( e ) => e.id === n.id ) );
	return [ ...existing, ...newItems ];
}

const actions = {
	setPosts( posts: RelationshipItem[] ) {
		return {
			type: 'SET_POSTS' as const,
			items: posts,
		};
	},

	getPosts( postIds: number[], postTypes: string | string[] ) {
		return {
			type: 'GET_POSTS' as const,
			ids: postIds,
			postTypes,
		};
	},

	getItems( items: number[], path: string ) {
		return {
			type: 'GET_ITEMS' as const,
			items,
			path,
		};
	},

	setItems( items: RelationshipItem[] ) {
		return {
			type: 'SET_ITEMS' as const,
			items,
		};
	},

	setTaxonomies( taxonomies: RelationshipItem[] ) {
		return {
			type: 'SET_TAXONOMIES' as const,
			items: taxonomies,
		};
	},

	getTaxonomies( postIds: number[] ) {
		return {
			type: 'GET_TAXONOMIES' as const,
			ids: postIds,
		};
	},
};

type Actions = ReturnType< typeof actions[ keyof typeof actions ] >;

const store = createReduxStore( 'gumponents/relationship', {
	reducer( state: RelationshipState = DEFAULT_STATE, action: Actions ) {
		switch ( action.type ) {
			case 'SET_POSTS':
				return {
					...state,
					posts: dedup( state.posts, action.items ),
				};
			case 'SET_ITEMS':
				return {
					...state,
					items: dedup( state.items, action.items ),
				};
			case 'SET_TAXONOMIES':
				return {
					...state,
					taxonomies: dedup( state.taxonomies, action.items ),
				};
		}
		return state;
	},

	actions,

	selectors: {
		getPosts( state: RelationshipState, ids: number[] ): RelationshipItem[] {
			const posts: RelationshipItem[] = [];
			ids.forEach( ( id ) => {
				const post = state.posts.find( ( p ) => p.id === id );
				if ( post ) {
					posts.push( post );
				}
			} );
			return posts;
		},

		getItems( state: RelationshipState, ids: number[] ): RelationshipItem[] {
			const items: RelationshipItem[] = [];

			if ( ! Array.isArray( ids ) || ids.length === 0 ) {
				return items;
			}

			ids.forEach( ( id ) => {
				const item = state.items.find( ( i ) => i.id === id );
				if ( item ) {
					items.push( item );
				}
			} );

			return items;
		},

		getTaxonomies( state: RelationshipState, ids: number[] ): RelationshipItem[] {
			const taxonomies: RelationshipItem[] = [];
			ids.forEach( ( id ) => {
				const taxonomy = state.taxonomies.find( ( t ) => t.id === id );
				if ( taxonomy ) {
					taxonomies.push( taxonomy );
				}
			} );
			return taxonomies;
		},
	},

	controls: {
		GET_POSTS( { ids, postTypes }: { ids: number[]; postTypes: string | string[] } ) {
			const types = typeof postTypes === 'string' ? [ postTypes ] : postTypes;

			return apiFetch< RelationshipItem[] >( {
				path: '/gumponents/relationship/v1/posts/initialize',
				data: {
					type: 'post',
					items: ids,
					post_types: types,
				},
				method: 'POST',
			} );
		},

		GET_ITEMS( { items, path }: { items: number[]; path: string } ) {
			return apiFetch< RelationshipItem[] >( {
				path,
				data: {
					items,
				},
				method: 'POST',
			} );
		},

		GET_TAXONOMIES( { ids }: { ids: number[] } ) {
			return apiFetch< RelationshipItem[] >( {
				path: '/gumponents/relationship/v1/taxonomies/initialize',
				data: {
					items: ids,
				},
				method: 'POST',
			} );
		},
	},

	resolvers: {
		*getPosts( ids: number[], postTypes: string | string[] ) {
			if ( ids.length === 0 ) {
				return;
			}
			const posts: RelationshipItem[] = yield actions.getPosts( ids, postTypes );
			return actions.setPosts( posts );
		},

		*getItems( ids: number[], path: string ) {
			if ( ids.length === 0 ) {
				return;
			}
			const items: RelationshipItem[] = yield actions.getItems( ids, path );
			return actions.setItems( items );
		},

		*getTaxonomies( ids: number[] ) {
			if ( ids.length === 0 ) {
				return;
			}
			const taxonomies: RelationshipItem[] = yield actions.getTaxonomies( ids );
			return actions.setTaxonomies( taxonomies );
		},
	},
} );

register( store );
