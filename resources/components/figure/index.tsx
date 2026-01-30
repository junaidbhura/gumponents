import Img from '../img';
import type { ImageDetails } from '../../types';

interface FigureProps {
	value: ImageDetails | string | null;
	className?: string;
}

export default function Figure( { value, className }: FigureProps ) {
	if ( ! value ) {
		return null;
	}

	let image: ImageDetails;
	if ( typeof value === 'string' ) {
		image = JSON.parse( value ) as ImageDetails;
	} else {
		image = value;
	}

	return (
		<figure className={ className }>
			<Img value={ image } />
			{ image.caption && <figcaption>{ image.caption }</figcaption> }
		</figure>
	);
}
