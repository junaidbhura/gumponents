import apiFetch from '@wordpress/api-fetch';
import { useSelect, useDispatch } from '@wordpress/data';
import Relationship from '../relationship';
import type { RelationshipItem } from '../../types';

interface PostRelationshipControlProps {
	value: number[];
	postTypes: string | string[];
	postStatus?: string | string[];
	taxonomies?: Array< Record< string, string[] > >;
	filter?: string;
	additionalParams?: Record< string, unknown >;
	label?: string;
	help?: string;
	buttonLabel?: string;
	modalTitle?: string;
	minimal?: boolean;
	max?: number;
	onSelect?: ( values: Array< RelationshipItem[ 'value' ] > ) => void;
}

export default function PostRelationshipControl( props: PostRelationshipControlProps ) {
	const { value, postTypes, postStatus, taxonomies, filter, additionalParams } = props;

	const initialItems = useSelect(
		( select ) => select( 'gumponents/relationship' ).getPosts( value, postTypes ),
		[ value, postTypes ],
	);

	const { setPosts: onSetItems } = useDispatch( 'gumponents/relationship' );

	return (
		<Relationship
			{ ...props }
			initialItems={ initialItems }
			onSetItems={ onSetItems }
			searchQuery={ ( query ) => {
				return apiFetch< RelationshipItem[] >( {
					path: '/gumponents/relationship/v1/posts/query',
					data: {
						post_types: postTypes,
						post_taxonomies: taxonomies,
						post_status: postStatus,
						search: query,
						filter,
						additional_params: additionalParams,
					},
					method: 'POST',
				} );
			} }
		/>
	);
}
