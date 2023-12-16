import './editor.scss';

import wp from 'wp';

const { __ } = wp.i18n;
const {
	Button,
	BaseControl,
	Spinner,
} = wp.components;
const { MediaUpload } = wp.blockEditor;
const {
	useState,
	useEffect,
} = wp.element;
const {
	withSelect,
	withDispatch,
} = wp.data;
const { compose } = wp.compose;

function FileControl( { value, file, help, allowedTypes, label = __( 'Select file' ), selectLabel = __( 'Select file' ), removeLabel = __( 'Remove file' ), onSetFile, onChange } ) {
	const [ id, setId ] = useState( null );

	useEffect(
		() => setId( value ),
		[ value ]
	);

	const onSelectFile = ( media ) => {
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
			file: value ? getMedia( value ) : null,
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

