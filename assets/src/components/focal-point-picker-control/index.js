import './editor.scss';

import wp from 'wp';

const { __ } = wp.i18n;
const {
	Button,
	Modal,
	BaseControl,
	FocalPointPicker,
} = wp.components;
const {
	useState,
} = wp.element;

function FocalPointPickerControl( { label = '', value = {}, onChange = () => {}, imageUrl = '', help = '', buttonLabel = __( 'Select', 'gumponents' ), modalTitle = __( 'Select', 'gumponents' ) } ) {
	// Initialize State.
	const initialFocalPointValue = ( value.x && value.y ) ? value : { x: 0.5, y: 0.5 };
	const [ modalOpen, setModalOpen ] = useState( false );
	const [ focalPoint, setFocalPoint ] = useState( initialFocalPointValue );

	if ( ! imageUrl ) {
		return null;
	}

	/**
	 * Handle Set Focal Point.
	 *
	 * @param {Object} focalPointData Focal Point Data.
	 */
	const handleSetFocalPoint = ( focalPointData ) => {
		setFocalPoint( focalPointData );
		onChange( focalPoint );
	};

	/**
	 * Open modal.
	 */
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

			{ modalOpen &&
				<Modal
					title={ modalTitle }
					className="gumponent-focal-point-picker__modal"
					onRequestClose={ () => setModalOpen( false ) }>
					<FocalPointPicker
						url={ imageUrl }
						value={ focalPoint }
						onDragStart={ handleSetFocalPoint }
						onDrag={ handleSetFocalPoint }
						onChange={ handleSetFocalPoint }
					/>
				</Modal>
			}
		</BaseControl>
	);
}

export default FocalPointPickerControl;
