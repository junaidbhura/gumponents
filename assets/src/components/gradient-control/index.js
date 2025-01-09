import wp from 'wp';

const { useState, useEffect } = wp.element;
const {
	BaseControl,
	__experimentalInputControl: InputControl,
	RangeControl,
} = wp.components;

export default function GradientControl( { label, help, firstColor, secondColor, firstLocation, secondLocation, angle, onChange } ) {
	// Control states.
	const [ gradientState, setGradientState ] = useState( {
		firstColor,
		firstLocation,
		secondColor,
		secondLocation,
		angle,
	} );

	const updateGradientState = ( key, value ) => {
		setGradientState( ( prevState ) => ( {
			...prevState,
			[ key ]: value,
		} ) );
	};

	// Emit updated gradient to parent
	useEffect( () => {
		onChange( gradientState );
	}, [ gradientState, onChange ] );

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
				value={ gradientState.firstColor }
				onChange={ ( value ) => updateGradientState( 'firstColor', value ) }
			/>
			<RangeControl
				label={ 'Location (%)' }
				value={ gradientState.firstLocation }
				onChange={ ( value ) => updateGradientState( 'firstLocation', value ) }
				min={ 0 }
				max={ 100 }
			/>
			<InputControl
				label={ 'Second Color' }
				__unstableInputWidth="5em"
				labelPosition="edge"
				type="color"
				value={ gradientState.secondColor }
				onChange={ ( value ) => updateGradientState( 'secondColor', value ) }
			/>
			<RangeControl
				label={ 'Location (%)' }
				value={ gradientState.secondLocation }
				onChange={ ( value ) => updateGradientState( 'secondLocation', value ) }
				min={ 0 }
				max={ 100 }
			/>
			<RangeControl
				label={ 'Angle (deg)' }
				value={ gradientState.angle }
				onChange={ ( value ) => updateGradientState( 'angle', value ) }
				min={ 0 }
				max={ 360 }
			/>
		</BaseControl>
	);
}
