import './editor.scss';
import { SearchLinkModal } from './modal';
import type { LinkValue } from '../link-control/modal';

import { __ } from '@wordpress/i18n';
import { BaseControl, Button, Icon } from '@wordpress/components';
import { useState } from '@wordpress/element';

interface Suggestion {
	id: number;
	title: string;
	url: string;
	type: string;
	subtype: string;
}

interface SearchLinkControlProps {
	value?: LinkValue | null;
	label?: string;
	help?: string;
	postTypes?: string | string[];
	hidePostTypesControl?: boolean;
	onUrl?: ( url: string, suggestion: Suggestion | null ) => void;
	onChange: ( value: LinkValue ) => void;
	buttonLabel?: string;
	modalTitle?: string;
}

export default function SearchLinkControl( {
	value,
	label,
	help,
	postTypes = [ 'post', 'page' ],
	hidePostTypesControl = false,
	onUrl,
	onChange,
	buttonLabel = __( 'Select URL' ),
	modalTitle = __( 'Search & Select URL' ),
}: SearchLinkControlProps ) {
	const [ modalOpen, setModalOpen ] = useState( false );
	const url = value?.url;
	const text = value?.text;
	const newWindow = value?.newWindow;

	return (
		<BaseControl
			label={ label }
			help={ help }
			className="gumponents-search-link-control"
		>
			<Button
				isDefault
				onClick={ () => setModalOpen( true ) }
			>
				{ buttonLabel }
			</Button>
			{ value && url !== '' && (
				<div className="gumponents-search-link-control__preview">
					<a
						href={ url }
						target="_blank"
						rel="noopener noreferrer"
						className="gumponents-search-link-control__preview-link"
					>
						{ text === '' && url }
						{ text }
					</a>
					{ newWindow !== false && (
						<Icon
							icon="external"
							size={ 15 }
							className="gumponents-search-link-control__preview-icon"
						/>
					) }
				</div>
			) }
			{ modalOpen && (
				<SearchLinkModal
					className="gumponents-search-link-control"
					title={ modalTitle }
					onRequestClose={ () => setModalOpen( false ) }
					value={ value }
					hidePostTypesControl={ hidePostTypesControl }
					postTypes={ postTypes }
					onChange={ ( val ) => onChange( val ) }
					onUrl={ onUrl }
				/>
			) }
		</BaseControl>
	);
}
