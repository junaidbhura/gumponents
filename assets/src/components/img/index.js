import React from 'react';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';

class Img extends React.Component {
	render() {
		const { value, className } = this.props;

		if ( isEmpty( value ) ) {
			return '';
		}

		let image = value;
		if ( isString( value ) ) {
			image = JSON.parse( image );
		}

		return (
			<img
				className={ classnames( `wp-image-${ image.id }`, `size-${ image.size }`, className ) }
				src={ image.src }
				width={ image.width }
				height={ image.height }
				alt={ image.alt }
				title={ ! isEmpty( image.title ) ? image.title : null }
			/>
		);
	}
}

export default Img;
