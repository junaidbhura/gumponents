import wp from 'wp';
import React from 'react';

import Relationship from '../relationship';

const { apiFetch } = wp;

class PostRelationshipControl extends React.Component {

	render() {
		return (
			<Relationship
				{ ...this.props }
				searchQuery={ query => {
					const { postTypes, taxonomies, filter } = this.props;
					return new Promise( resolve => {
						apiFetch( {
							path: '/gumponents/relationship/v1/query',
							data: {
								'type': 'post',
								'post_types': postTypes,
								'post_taxonomies': taxonomies,
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

export default PostRelationshipControl;
