import { UrlModal } from '../link-control/modal';
import type { LinkValue } from '../link-control/modal';

import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';
import classnames from 'classnames';

interface LinkButtonProps {
	tagName?: keyof JSX.IntrinsicElements;
	value?: LinkValue | null;
	className?: string;
	placeholder?: string;
	modalTitle?: string;
	onChange: ( value: LinkValue ) => void;
}

export default function LinkButton( {
	tagName = 'button',
	value,
	className = 'wp-block-button',
	placeholder = __( 'Button' ),
	modalTitle = __( 'URL' ),
	onChange,
}: LinkButtonProps ) {
	const [ modalOpen, setModalOpen ] = useState( false );
	const text = value?.text;
	const Tag = tagName;
	let label = placeholder;

	if ( text && text !== '' ) {
		label = text;
	}

	return (
		<>
			<Tag
				className={ classnames(
					className,
					'gumponents-link-button',
				) }
				onClick={ () => setModalOpen( true ) }
			>
				{ decodeEntities( label ) }
			</Tag>
			{ modalOpen && (
				<UrlModal
					className="gumponents-link-button__modal"
					title={ modalTitle }
					onRequestClose={ () => setModalOpen( false ) }
					value={ value }
					onChange={ ( val ) => onChange( val ) }
				/>
			) }
		</>
	);
}
