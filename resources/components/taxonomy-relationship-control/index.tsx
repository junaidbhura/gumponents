import apiFetch from '@wordpress/api-fetch';
import { useSelect, useDispatch } from '@wordpress/data';
import Relationship from '../relationship';
import type { RelationshipItem } from '../../types';

interface TaxonomyRelationshipControlProps {
	value: number[];
	taxonomies: string | string[];
	filter?: string;
	label?: string;
	help?: string;
	buttonLabel?: string;
	modalTitle?: string;
	minimal?: boolean;
	max?: number;
	onSelect?: ( values: Array< RelationshipItem[ 'value' ] > ) => void;
}

export default function TaxonomyRelationshipControl( props: TaxonomyRelationshipControlProps ) {
	const { value, taxonomies, filter } = props;

	const initialItems = useSelect(
		( select ) => select( 'gumponents/relationship' ).getTaxonomies( value ),
		[ value ],
	);

	const { setTaxonomies: onSetItems } = useDispatch( 'gumponents/relationship' );

	return (
		<Relationship
			{ ...props }
			initialItems={ initialItems }
			onSetItems={ onSetItems }
			searchQuery={ ( query ) => {
				return apiFetch< RelationshipItem[] >( {
					path: '/gumponents/relationship/v1/taxonomies/query',
					data: {
						taxonomies,
						search: query,
						filter,
					},
					method: 'POST',
				} );
			} }
		/>
	);
}
