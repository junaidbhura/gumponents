import { Component } from 'react';
import wp from 'wp';
import Select from 'react-select';
import forEach from 'lodash/forEach';
import find from 'lodash/find';

const {
	BaseControl,
} = wp.components;

class MultiSelectControl extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			options: [],
			value: [],
		};

		this.onChange = this.onChange.bind( this );
		this.getValues = this.getValues.bind( this );
	}

	componentDidMount() {
		const { options, value } = this.props;
		if ( options ) {
			this.setState( { options } );
		}
		if ( value ) {
			this.setState( { value } );
		}
	}

	onChange( values ) {
		const value = values.map( ( val ) => val.value );
		this.setState( { value } );
		if ( this.props.onChange ) {
			this.props.onChange( value, this.state.value );
		}
	}

	getValues() {
		let values = [];
		forEach( this.state.value, ( value ) => {
			const obj = find( this.state.options, [ 'value', value ] );
			if ( obj ) {
				values.push( obj );
			}
		} );
		return values;
	}

	render() {
		const { label, help, placeholder, ...reactSelectProps } = this.props;
		return (
			<BaseControl
				label={ label }
				help={ help }
				className="gumponents-multi-select-control"
			>
				<Select
					{ ...reactSelectProps }
					value={ this.getValues() }
					options={ this.state.options }
					onChange={ this.onChange }
					placeholder={ placeholder }
					isMulti
				/>
			</BaseControl>
		);
	}
}

export default MultiSelectControl;
