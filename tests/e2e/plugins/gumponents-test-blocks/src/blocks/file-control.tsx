import { useState } from '@wordpress/element';

const { FileControl } = window.gumponents.components;

function Edit() {
	const [ fileId, setFileId ] = useState< number | null >( null );

	return (
		<div data-testid="gumponents-test-file-control">
			<FileControl
				label="Test File"
				value={ fileId }
				onChange={ ( media: { id: number } | null ) => {
					setFileId( media?.id ?? null );
				} }
			/>
			<div data-testid="file-control-id">
				{ String( fileId ?? '' ) }
			</div>
		</div>
	);
}

export default {
	title: 'Test: File Control',
	category: 'common',
	edit: Edit,
	save: () => null,
};
