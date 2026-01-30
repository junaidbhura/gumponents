import apiFetch from '@wordpress/api-fetch';
import { useSelect, useDispatch } from '@wordpress/data';
import Relationship from '../relationship';
import type { RelationshipItem } from '../../types';

interface RelationshipControlProps {
	value?: number[];
	searchApiPath?: string;
	getItemsApiPath?: string;
	label?: string;
	help?: string;
	buttonLabel?: string;
	modalTitle?: string;
	minimal?: boolean;
	max?: number;
	onSelect?: ( values: Array< RelationshipItem[ 'value' ] > ) => void;
}

export default function RelationshipControl( props: RelationshipControlProps ) {
	const { value = [], searchApiPath = '', getItemsApiPath = '' } = props;

	const initialItems = useSelect(
		( select ) => select( 'gumponents/relationship' ).getItems( value, getItemsApiPath ),
		[ value, getItemsApiPath ],
	);

	const { setItems: onSetItems } = useDispatch( 'gumponents/relationship' );

	return (
		<Relationship
			{ ...props }
			initialItems={ initialItems }
			onSetItems={ onSetItems }
			searchQuery={ ( query ) => {
				return apiFetch< RelationshipItem[] >( {
					path: searchApiPath,
					method: 'POST',
					data: {
						query,
					},
				} );
			} }
		/>
	);
}
