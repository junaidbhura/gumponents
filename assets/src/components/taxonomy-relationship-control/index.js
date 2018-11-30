import wp from 'wp';
import React from 'react';

import Relationship from '../relationship';

const { apiFetch } = wp;

const {
	withSelect,
	withDispatch,
} = wp.data;

class TaxonomyRelationshipControl extends React.Component {

	render() {
		return (
			<Relationship
				{ ...this.props }
				searchQuery={ query => {
					const { taxonomies, filter } = this.props;
					return new Promise( resolve => {
						apiFetch( {
							path: '/gumponents/relationship/v1/taxonomies/query',
							data: {
								'taxonomies': taxonomies,
								'search': query,
								'filter': filter,
							},
							method: 'post',
						} ).then( results => resolve( results ) );
					} );
				} }
			/>
		);
	}

}

export default withSelect( ( select, ownProps ) => {
	return {
		getInitialItems: select( 'gumponents/relationship' ).getTaxonomies( ownProps.value ),
	};
} )( withDispatch( ( dispatch, ownProps ) => {
	return {
		onSetItems( items ) {
			dispatch( 'gumponents/relationship' ).setTaxonomies( items );
		},
	};
} )( TaxonomyRelationshipControl ) );
