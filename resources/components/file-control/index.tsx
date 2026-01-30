import './editor.scss';

import { __ } from '@wordpress/i18n';
import { Button, BaseControl, Spinner } from '@wordpress/components';
import { MediaUpload } from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import type { MediaItem } from '../../types';

interface FileData extends MediaItem {
	icon: string;
	filename: string;
	filesizeHumanReadable: string;
}

interface FileControlProps {
	value?: number | null;
	help?: string;
	allowedTypes?: string[];
	label?: string;
	selectLabel?: string;
	removeLabel?: string;
	onChange?: ( media: MediaItem | null ) => void;
}

export default function FileControl( {
	value,
	help,
	allowedTypes,
	label = __( 'Select file' ),
	selectLabel = __( 'Select file' ),
	removeLabel = __( 'Remove file' ),
	onChange,
}: FileControlProps ) {
	const [ id, setId ] = useState< number | null >( null );

	const file = useSelect(
		( select ) => {
			const { getMedia } = select( 'gumponents/media' );
			return value ? getMedia( value ) : null;
		},
		[ value ],
	) as FileData | null;

	const { setMedia: onSetFile } = useDispatch( 'gumponents/media' );

	useEffect( () => {
		setId( value ?? null );
	}, [ value ] );

	const onSelectFile = ( media: MediaItem ) => {
		setId( media.id );
		onSetFile( media );

		if ( onChange ) {
			onChange( media );
		}
	};

	const onRemoveFile = () => {
		setId( null );

		if ( onChange ) {
			onChange( null );
		}
	};

	return (
		<BaseControl
			help={ help }
			label={ label }
			className="gumponents-file-control"
		>
			<MediaUpload
				title={ selectLabel }
				onSelect={ onSelectFile }
				allowedTypes={ allowedTypes }
				render={ ( { open }: { open: () => void } ) => (
					<Button
						isDefault
						className="gumponents-file-control__select"
						onClick={ open }
					>
						{ selectLabel }
					</Button>
				) }
			/>
			{ id && (
				<div className="gumponents-file-control__details">
					{ file && (
						<div className="gumponents-file-control__details-container">
							<div className="gumponents-file-control__icon">
								<img
									src={ file.icon }
									alt=""
								/>
							</div>
							<div className="gumponents-file-control__file-details">
								<p>{ file.filename }</p>
								<p>{ file.filesizeHumanReadable }</p>
							</div>
						</div>
					) }
					{ ! file && <Spinner /> }
				</div>
			) }
			{ id && file && (
				<Button onClick={ onRemoveFile } isLink isDestructive>
					{ removeLabel }
				</Button>
			) }
		</BaseControl>
	);
}
