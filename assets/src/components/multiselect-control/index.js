import React, { Component } from 'react';
import wp from 'wp';
import uniqBy from 'lodash/uniqBy';
import find from 'lodash/find';
import forEach from 'lodash/forEach';

const {
	BaseControl,
	FormTokenField,
} = wp.components;

class MultiSelectControl extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			options: [],
			value: [],
		};

		this.onChange = this.onChange.bind( this );
	}

	componentDidMount() {
		const { options, value } = this.props;
		let preparedOptions = [];
		if ( options ) {
			preparedOptions = this.prepareOptions( options );
			this.setState( { options: preparedOptions } );
		}
		if ( value ) {
			this.setState( { value: this.prepareValues( value, preparedOptions ) } );
		}
	}

	prepareOptions( options ) {
		return uniqBy( options, 'value' );
	}

	prepareValues( values, options ) {
		let value = [];
		forEach( values, ( val ) => { // eslint-ignore-line
			const obj = find( options, [ 'value', val ] );
			if ( obj ) {
				value.push( obj );
			}
		} );
		return value;
	}

	getValueFromTokens( tokens ) {
		let value = [];
		forEach( tokens, ( token ) => {
			const obj = find( this.state.options, [ 'title', token ] );
			if ( obj ) {
				value.push( obj );
			}
		} );
		return value;
	}

	onChange( tokens ) {
		const value = this.getValueFromTokens( tokens );
		this.setState( { value } );
		if ( this.props.onChange ) {
			this.props.onChange( value.map( ( val ) => val.value ) );
		}
	}

	render() {
		const { help, label } = this.props;
		return (
			<BaseControl
				help={ help }
				className="gumponents-multi-select-control"
			>
				<FormTokenField
					label={ label }
					value={ this.state.value.map( ( val ) => val.title ) }
					suggestions={ this.state.options.map( ( option ) => option.title ) }
					onChange={ this.onChange }
				/>
			</BaseControl>
		);
	}
}

export default MultiSelectControl;
