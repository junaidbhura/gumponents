import './editor.scss';

import { BaseControl } from '@wordpress/components';
import Select from 'react-select';
import type { Props as ReactSelectProps } from 'react-select';

interface Option {
	label: string;
	value: string;
}

interface MultiSelectControlProps extends Omit< ReactSelectProps< Option, true >, 'value' | 'options' | 'onChange' | 'isMulti' > {
	value?: string[];
	options?: Option[];
	label?: string;
	help?: string;
	placeholder?: string;
	onChange?: ( values: string[] ) => void;
}

export default function MultiSelectControl( {
	value = [],
	options = [],
	label,
	help,
	placeholder,
	onChange,
	...reactSelectProps
}: MultiSelectControlProps ) {
	const values = value
		.filter( ( token ) => options.some( ( option ) => option.value === token ) )
		.map( ( token ) => options.find( ( option ) => option.value === token )! );

	const valuesUpdated = ( newValues: readonly Option[] | null ) => {
		if ( ! onChange ) {
			return;
		}

		if ( newValues === null ) {
			onChange( [] );
			return;
		}

		onChange(
			( newValues as Option[] )
				.filter( ( token ) => options.some( ( option ) => option.value === token.value ) )
				.map( ( token ) => token.value ),
		);
	};

	return (
		<BaseControl
			label={ label }
			help={ help }
			className="gumponents-multi-select-control"
		>
			<Select< Option, true >
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
