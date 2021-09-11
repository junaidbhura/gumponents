import { UrlModal } from '../link-control/modal';

import wp from 'wp';
import React from 'react';
import classnames from 'classnames';

const { __ } = wp.i18n;
const { useState } = wp.element;

export default function LinkButton( {
	tagName = 'button',
	value,
	className = 'wp-block-button',
	placeholder = __( 'Button' ),
	modalTitle = __( 'URL' ),
	onChange,
} ) {
	const [ modalOpen, setModalOpen ] = useState( false );
	const { text } = value ?? {};
	const Tag = tagName;
	let label = placeholder;

	if ( text && '' !== text ) {
		label = text;
	}

	return (
		<>
			<Tag
				className={ classnames(
					className,
					'gumponents-link-button'
				) }
				onClick={ () => setModalOpen( true ) }
			>
				{ label }
			</Tag>
			{ modalOpen &&
				<UrlModal
					className="gumponents-link-button__modal"
					title={ modalTitle }
					onRequestClose={ () => setModalOpen( false ) }
					value={ value }
					onChange={ ( value ) => onChange( value ) }
				/>
			}
		</>
	);
}
