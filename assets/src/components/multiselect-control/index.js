import './editor.scss';

import wp from 'wp';
import Select from 'react-select';

const { BaseControl } = wp.components;

export default function MultiSelectControl( { value = [], options = [], label, help, placeholder, onChange, ...reactSelectProps } ) {
	// Filter out any values that are not in the options list and map them to the option object.
	const values = value
		.filter( ( token ) => options.some( ( option ) => option.value === token ) )
		.map( ( token ) => options.find( ( option ) => option.value === token ) );

	const valuesUpdated = ( values ) => {
		if ( ! onChange ) {
			return;
		}

		if ( null === values ) {
			onChange( [] );
			return;
		}

		// Only return the values that are in the options list.
		onChange(
			values
				.filter( ( token ) => options.some( ( option ) => option.value === token.value ) )
				.map( ( token ) => token.value )
		);
	};

	return (
		<BaseControl
			label={ label }
			help={ help }
			className="gumponents-multi-select-control"
		>
			<Select
				{ ...reactSelectProps }
				value={ values }
				options={ options }
				onChange={ valuesUpdated }
				placeholder={ placeholder }
				isMulti
			/>
		</BaseControl>
	);
}
