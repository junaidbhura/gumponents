import './editor.scss';

import React from 'react';
import wp from 'wp';
import classnames from 'classnames';

const { __ } = wp.i18n;

const {
	Button,
	Modal,
	Spinner,
	BaseControl,
} = wp.components;

import Selector from './selector';

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
		if ( ! this.state.initialized && this.props.value && 0 === this.state.items.length && 0 !== this.props.value.length ) {
			this.setState( {
				loading: true,
			} );
			this.props.getInitialItems.then( items => {
				this.setState( {
					loading: false,
					items: items,
				} );
				this.props.onSetItems( items );
			} );
		}
	}

	itemsSelected() {
		this.setState( {
			items: this.items,
			modalOpen: false,
		} );
		if ( this.props.onSelect ) {
			this.props.onSelect( this.items.map( item => item.value ) );
		}
		this.props.onSetItems( this.items );
	}

	render() {
		let { label, buttonLabel, modalTitle, noSelectionLabel, minimal, searchQuery, help, max } = this.props;
		const { items, loading, modalOpen } = this.state;

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
		if ( ! max ) {
			max = -1;
		}

		return (
			<BaseControl
				label={ label }
				help={ help }
				className="gumponent-relationship">
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
							maxItems={ max }
							onSelect={ items => { this.items = items; } }
							selected={ items }
							searchQuery={ searchQuery }
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
			</BaseControl>
		);
	}

}

export default Relationship;
