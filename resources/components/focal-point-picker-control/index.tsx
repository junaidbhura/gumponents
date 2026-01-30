import './editor.scss';

import { __ } from '@wordpress/i18n';
import {
	Button,
	Modal,
	BaseControl,
	FocalPointPicker,
} from '@wordpress/components';
import { useState } from '@wordpress/element';

interface FocalPoint {
	x: number;
	y: number;
}

interface FocalPointPickerControlProps {
	label?: string;
	value?: FocalPoint;
	onChange?: ( focalPoint: FocalPoint ) => void;
	imageUrl?: string;
	help?: string;
	buttonLabel?: string;
	modalTitle?: string;
}

function FocalPointPickerControl( {
	label = '',
	value = { x: 0.5, y: 0.5 },
	onChange = () => {},
	imageUrl = '',
	help = '',
	buttonLabel = __( 'Select', 'gumponents' ),
	modalTitle = __( 'Select', 'gumponents' ),
}: FocalPointPickerControlProps ) {
	const initialFocalPointValue = value.x && value.y ? value : { x: 0.5, y: 0.5 };
	const [ modalOpen, setModalOpen ] = useState( false );
	const [ focalPoint, setFocalPoint ] = useState< FocalPoint >( initialFocalPointValue );

	if ( ! imageUrl ) {
		return null;
	}

	const handleSetFocalPoint = ( focalPointData: FocalPoint ) => {
		setFocalPoint( focalPointData );
		onChange( focalPoint );
	};

	const openModal = () => {
		setModalOpen( true );
	};

	return (
		<BaseControl
			label={ label }
			help={ help }
			className="gumponent-focal-point-picker"
		>
			<Button
				isSecondary
				onClick={ openModal }
			>
				{ buttonLabel }
			</Button>

			{ modalOpen && (
				<Modal
					title={ modalTitle }
					className="gumponent-focal-point-picker__modal"
					onRequestClose={ () => setModalOpen( false ) }
				>
					<FocalPointPicker
						url={ imageUrl }
						value={ focalPoint }
						onDragStart={ handleSetFocalPoint }
						onDrag={ handleSetFocalPoint }
						onChange={ handleSetFocalPoint }
					/>
				</Modal>
			) }
		</BaseControl>
	);
}

export default FocalPointPickerControl;
