import './editor.scss';

import { __ } from '@wordpress/i18n';
import { Button, Modal, Spinner, BaseControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import classnames from 'classnames';
import Selector from './selector';
import type { RelationshipItem } from '../../types';

interface RelationshipProps {
	initialItems: RelationshipItem[];
	label?: string;
	searchQuery: ( query?: string ) => Promise< RelationshipItem[] >;
	help?: string;
	buttonLabel?: string;
	modalTitle?: string;
	minimal?: boolean;
	max?: number;
	onSelect?: ( values: Array< RelationshipItem[ 'value' ] > ) => void;
	onSetItems: ( items: RelationshipItem[] ) => void;
}

export default function Relationship( {
	initialItems,
	label,
	searchQuery,
	help,
	buttonLabel = __( 'Select' ),
	modalTitle = __( 'Select' ),
	minimal = false,
	max = -1,
	onSelect,
	onSetItems,
}: RelationshipProps ) {
	const [ items, setItems ] = useState< RelationshipItem[] >( [] );
	const [ userSelection, setUserSelection ] = useState< RelationshipItem[] >( [] );
	const [ loading, setLoading ] = useState( true );
	const [ modalOpen, setModalOpen ] = useState( false );

	useEffect( () => {
		setItems( initialItems );
		setLoading( false );
	}, [ initialItems ] );

	const selectItems = () => {
		setItems( userSelection );
		setModalOpen( false );
		if ( onSelect ) {
			onSelect( userSelection.map( ( item ) => item.value ) );
		}
		onSetItems( userSelection );
	};

	const openModal = () => {
		setUserSelection( items );
		setModalOpen( true );
	};

	return (
		<BaseControl
			label={ label }
			help={ help }
			className="gumponent-relationship"
		>
			<Button
				isSecondary
				isBusy={ minimal && loading }
				onClick={ openModal }
			>
				{ buttonLabel }
			</Button>
			{ ! minimal && items.length !== 0 && (
				<ul
					className={ classnames( 'gumponent-relationship__selected-items', {
						'gumponents-relationship__selected-items--loading': loading,
					} ) }
				>
					{ loading && <li><Spinner /></li> }
					{ ! loading && items.length !== 0 &&
						items.map( ( item, index ) => {
							if ( index === 3 ) {
								return (
									<li key={ 4 }>
										... { `${ items.length - 3 } ${ __( 'more' ) }` }
									</li>
								);
							} else if ( index > 3 ) {
								return null;
							}
							return <li key={ index }>&#10003; { item.label }</li>;
						} )
					}
				</ul>
			) }
			{ modalOpen && (
				<Modal
					title={ modalTitle }
					className="gumponent-relationship__modal"
					onRequestClose={ () => setModalOpen( false ) }
				>
					<Selector
						maxItems={ max }
						onSelect={ ( newItems ) => setUserSelection( newItems ) }
						items={ userSelection }
						searchQuery={ searchQuery }
					/>
					<div className="gumponent-relationship__modal__actions">
						<Button
							isPrimary
							onClick={ selectItems }
						>
							{ __( 'Select' ) }
						</Button>
					</div>
				</Modal>
			) }
		</BaseControl>
	);
}
