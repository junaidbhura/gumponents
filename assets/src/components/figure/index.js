import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import Img from '../img';

export default function Figure( { value, className } ) {
	if ( isEmpty( value ) ) {
		return '';
	}

	let image = value;
	if ( isString( value ) ) {
		image = JSON.parse( image );
	}

	return (
		<figure className={ className }>
			<Img
				value={ image }
			/>
			{ ! isEmpty( image.caption ) &&
				<figcaption>{ image.caption }</figcaption>
			}
		</figure>
	);
}
