import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';

export default function Img( { value, className } ) {
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
