import './editor.scss';

import wp from 'wp';

const { __ } = wp.i18n;
const {
	Button,
	BaseControl,
	Spinner,
} = wp.components;
const { MediaUpload } = wp.editor;
const {
	useState,
	useEffect,
} = wp.element;
const {
	withSelect,
	withDispatch,
} = wp.data;
const { compose } = wp.compose;

function FileControl( { value, selectedFile, help, label = __( 'Select file' ), selectLabel = __( 'Select file' ), removeLabel = __( 'Remove file' ), onSetFile, onChange } ) {
	const [ id, setId ] = useState( null );
	const [ file, setFile ] = useState( null );

	useEffect(
		() => setId( value ),
		[ value ]
	);

	useEffect(
		() => setFile( selectedFile ),
		[ selectedFile ]
	);

	const onSelectFile = ( media ) => {
		setId( media.id );
		setFile( media );

		onSetFile( media );

		if ( onChange ) {
			onChange( media );
		}
	};

	const onRemoveFile = () => {
		setId( null );
		setFile( null );

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
				render={ ( { open } ) => (
					<Button
						isDefault
						className="gumponents-file-control__select"
						onClick={ open }
					>
						{ selectLabel }
					</Button>
				) }
			/>
			{ id &&
				<div className="gumponents-file-control__details">
					{ file &&
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
					}
					{ ! file &&
						<Spinner />
					}
				</div>
			}
			{ id && file &&
				<Button onClick={ onRemoveFile } isLink isDestructive>
					{ removeLabel }
				</Button>
			}
		</BaseControl>
	);
}

export default compose(
	withSelect( ( select, ownProps ) => {
		const { getMedia } = select( 'gumponents/media' );
		const { value } = ownProps;

		return {
			selectedFile: value ? getMedia( value ) : null,
		};
	} ),
	withDispatch( ( dispatch ) => {
		return {
			onSetFile( media ) {
				dispatch( 'gumponents/media' ).setMedia( media );
			},
		};
	} ),
)( FileControl );

