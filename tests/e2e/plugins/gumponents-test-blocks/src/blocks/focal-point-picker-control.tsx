import { useState } from '@wordpress/element';

const { FocalPointPickerControl } = window.gumponents.components;

interface FocalPoint {
	x: number;
	y: number;
}

function Edit() {
	const [ focalPoint, setFocalPoint ] = useState< FocalPoint >( {
		x: 0.5,
		y: 0.5,
	} );

	return (
		<div data-testid="gumponents-test-focal-point-picker-control">
			<FocalPointPickerControl
				label="Test Focal Point"
				value={ focalPoint }
				onChange={ setFocalPoint }
				imageUrl="https://via.placeholder.com/300x200"
				buttonLabel="Select Focal Point"
				modalTitle="Focal Point Picker"
			/>
			<div data-testid="focal-point-x">
				{ String( focalPoint.x ) }
			</div>
			<div data-testid="focal-point-y">
				{ String( focalPoint.y ) }
			</div>
		</div>
	);
}

export default {
	title: 'Test: Focal Point Picker Control',
	category: 'common',
	edit: Edit,
	save: () => null,
};
