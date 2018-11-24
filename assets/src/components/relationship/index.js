import './editor.scss';

import wp from 'wp';
import classnames from 'classnames';

const {
	apiFetch
} = wp;

const { __ } = wp.i18n;

const {
	Button,
	Modal,
	Spinner,
} = wp.components;

import Selector from './selector';

const apiPath = '/gumponents/relationship/v1/initialize';

class Relationship extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			items: [],
			initialized: false,
			loading: false,
			modalOpen: false,
		};

		this.items = [];
		this.itemsSelected = this.itemsSelected.bind( this );
	}

	componentDidMount() {
		if ( ! this.state.initialized && this.props.items && 0 === this.state.items.length && 0 !== this.props.items.length ) {
			this.setState( {
				loading: true,
			} );

			let {
				type,
				postTypes,
				taxonomies,
				items,
				filter,
			} = this.props;

			if ( ! type ) {
				type = 'post';
			}

			apiFetch( {
				path: apiPath,
				data: 'post' === type ? {
					'type': 'post',
					'post_types': postTypes,
					'items': items,
					'filter': filter,
				} : {
					'type': 'taxonomy',
					'taxonomies': taxonomies,
					'items': items,
					'filter': filter,
				},
				method: 'post',
			} ).then( items => {
				this.setState( {
					loading: false,
					initialized: true,
					items: items,
				} );
			} );
		}
	}

	itemsSelected() {
		this.setState( {
			items: this.items,
			modalOpen: false,
		} );
	}

	componentDidUpdate( prevProps, prevState ) {
		if ( prevState.items !== this.state.items && this.props.onSelect ) {
			this.props.onSelect( this.getValues( this.state.items ) );
		}
	}

	getValues( items ) {
		return items.map( item => item['value'] );
	}

	render() {
		let { buttonLabel, modalTitle, noSelectionLabel, minimal, type, postTypes, postTaxonomies, taxonomies, filter } = this.props;

		if ( ! buttonLabel ) {
			buttonLabel = __( 'Select' );
		}
		if ( ! modalTitle ) {
			modalTitle = __( 'Select' );
		}
		if ( ! noSelectionLabel ) {
			noSelectionLabel = __( 'No selection' );
		}
		if ( ! minimal ) {
			minimal = false;
		}

		const { items, loading, modalOpen } = this.state;

		return (
			<div className="gumponent-relationship">
				<Button
					isDefault
					isBusy={ minimal && loading }
					onClick={ () => this.setState( { modalOpen: true } ) }
				>
					{ buttonLabel }
				</Button>
				{ ! minimal &&
					<ul className={ classnames( 'gumponent-relationship__selected-items', loading ? 'gumponents-relationship__selected-items--loading' : null ) }>
						{ loading &&
							<li><Spinner /></li>
						}
						{ ! loading && 0 !== items.length &&
							items.map( ( item, index ) => {
								if ( 3 === index ) {
									return <li>... { `${ items.length - 3 } ${ __( 'more' ) }` }</li>
								} else if ( index > 3 ) {
									return;
								}
								return <li>✓ { item.label }</li>
							} )
						}
						{ ! loading && 0 === items.length &&
							<li>{ noSelectionLabel }</li>
						}
					</ul>
				}
				{ modalOpen &&
					<Modal
						title={ modalTitle }
						className="gumponent-relationship__modal"
						onRequestClose={ () => this.setState( { modalOpen: false } ) }>
						<Selector
							type={ type }
							postTypes={ postTypes }
							postTaxonomies={ postTaxonomies }
							taxonomies={ taxonomies }
							filter={ filter }
							onSelect={ items => { this.items = items; } }
							selected={ items }
						/>
						<div className="gumponent-relationship__modal__actions">
							<Button
								isPrimary
								onClick={ this.itemsSelected }
							>
								{ __( 'Select' ) }
							</Button>
						</div>
					</Modal>
				}
			</div>
		);
	}

}

export default Relationship;
