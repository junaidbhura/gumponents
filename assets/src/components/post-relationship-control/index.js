import wp from 'wp';
import React from 'react';
import forEach from 'lodash/forEach';

import Relationship from '../relationship';
import MultiSelectControl from '../multiselect-control';

const { __ } = wp.i18n;

const { apiFetch } = wp;

const {
	withSelect,
	withDispatch,
} = wp.data;

class PostRelationshipControl extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			filterLoading: false,
			filterPostTypes: [],
			postTypes: [],
		};

		this.setPostTypes = this.setPostTypes.bind( this );
	}

	componentDidMount() {
		if ( this.props.postTypes ) {
			this.setPostTypes( this.props.postTypes );
		}

		if ( this.props.showPostTypesFilter ) {
			this.setState( { filterLoading: true } );
		}
	}

	componentDidUpdate( prevProps ) {
		if ( this.props.allPostTypes !== prevProps.allPostTypes ) {
			let filterPostTypes = [];
			forEach( this.props.allPostTypes, ( postType ) => {
				filterPostTypes.push( {
					label: postType.label,
					value: postType.name,
				} );
			} );
			this.setState( {
				filterLoading: false,
				filterPostTypes,
			} );
		}
	}

	setPostTypes( postTypes ) {
		if ( 0 === postTypes.length ) {
			postTypes = [ 'post' ];
		}
		this.setState( { postTypes } );
	}

	render() {
		let filterControl;
		if ( this.props.showPostTypesFilter ) {
			filterControl = (
				<MultiSelectControl
					placeholder={ __( 'Post Types' ) }
					options={ this.state.filterPostTypes }
					value={ this.state.postTypes }
					isLoading={ this.state.filterLoading }
					onChange={ this.setPostTypes }
				/>
			);
		} else {
			filterControl = null;
		}

		return (
			<Relationship
				{ ...this.props }
				searchQuery={ ( query ) => {
					const { taxonomies, filter } = this.props;
					return new Promise( ( resolve ) => {
						apiFetch( {
							path: '/gumponents/relationship/v1/posts/query',
							data: {
								post_types: this.state.postTypes,
								post_taxonomies: taxonomies,
								search: query,
								filter,
							},
							method: 'post',
						} ).then( ( results ) => resolve( results ) );
					} );
				} }
				filterControl={ filterControl }
			/>
		);
	}
}

export default withSelect( ( select, ownProps ) => {
	return {
		getInitialItems: select( 'gumponents/relationship' ).getPosts( ownProps.value ),
		allPostTypes: select( 'gumponents/core' ).getPostTypes(),
	};
} )( withDispatch( ( dispatch ) => {
	return {
		onSetItems( items ) {
			dispatch( 'gumponents/relationship' ).setPosts( items );
		},
	};
} )( PostRelationshipControl ) );
