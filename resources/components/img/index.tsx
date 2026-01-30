import classnames from 'classnames';
import type { ImageDetails } from '../../types';

interface ImgProps {
	value: ImageDetails | string | null;
	className?: string;
}

export default function Img( { value, className }: ImgProps ) {
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
		<img
			className={ classnames( `wp-image-${ image.id }`, `size-${ image.size }`, className ) }
			src={ image.src }
			width={ image.width }
			height={ image.height }
			alt={ image.alt }
			title={ image.title || undefined }
		/>
	);
}
