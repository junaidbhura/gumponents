import './editor.scss';

import wp from 'wp';
const { useState } = wp.element;

const {
	BaseControl,
	__experimentalInputControl: InputControl,
	RangeControl,
} = wp.components;
// const { select } = wp.data;

export default function GradientControl( { label, help, value, onChange } ) {
	const [ firstColor, setFirstColor ] = useState();
	const [ firstLocation, setFirstLocation ] = useState();
	const [ secondColor, setSecondColor ] = useState();
	const [ secondLocation, setSecondLocation ] = useState();

	return (
		<BaseControl
			label={ label }
			help={ help }
			className="gumponents-gradient-control"
		>
			<InputControl
				label={ 'First Color' }
				__unstableInputWidth="5em"
				labelPosition="edge"
				type="color"
				value={ firstColor }
				onChange={ setFirstColor }
			/>
			<RangeControl
				label={ 'Location' }
				value={ firstLocation }
				onChange={ setFirstLocation }
				min={ 0 }
				max={ 100 }
			/>
			<InputControl
				label={ 'Second Color' }
				__unstableInputWidth="5em"
				labelPosition="edge"
				type="color"
				value={ secondColor }
				onChange={ setSecondColor }
			/>
			<RangeControl
				label={ 'Location' }
				value={ secondLocation }
				onChange={ setSecondLocation }
				min={ 0 }
				max={ 100 }
			/>
		</BaseControl>
	);
}
