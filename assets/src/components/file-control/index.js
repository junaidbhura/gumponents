import wp from 'wp';
import React from 'react';

import './data';

const { __ } = wp.i18n;

const {
	Button,
	BaseControl,
	Spinner,
} = wp.components;

const {
	MediaUpload,
} = wp.editor;

const {
	withSelect,
	withDispatch,
} = wp.data;

class FileControl extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			id: null,
			media: null,
		};
	}

	componentDidMount() {
		if ( this.props.value ) {
			this.setState( {
				id: this.props.value,
			} );
			this.props.getMedia.then( media => {
				this.setState( {
					media,
				} );
				this.props.onSetMedia( media );
			} );
		}
	}

	componentDidUpdate( prevProps, prevState ) {
		if ( prevProps.media !== this.props.media ) {
			this.setState( {
				media: this.props.media,
			} );
		}
	}

	render() {
		const { id, media } = this.state;
		let { help, label, selectLabel, removeLabel } = this.props;

		if ( ! label ) {
			label = __( 'Select file' );
		}
		if ( ! selectLabel ) {
			selectLabel = __( 'Select file' );
		}
		if ( ! removeLabel ) {
			removeLabel = __( 'Remove file' );
		}

		const onSelectFile = ( media ) => {
			this.setState( {
				id: media.id,
				media,
			} );

			this.props.onSetMedia( media );

			if ( this.props.onSelect ) {
				this.props.onChange( media );
			}
		};

		const onRemoveFile = () => {
			this.setState( {
				id: null,
				media: null,
			} );

			if ( this.props.onRemove ) {
				this.props.onChange( null );
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
						{ media &&
							<div className="gumponents-file-control__details-container">
								<img
									src={media.icon}
									className="gumponents-file-control__icon"
								/>
								<div className="gumponents-file-control__file-details">
									<p>{ media.filename }</p>
									<p>{ media.filesizeHumanReadable }</p>
								</div>
							</div>
						}
						{ ! media &&
							<Spinner />
						}
					</div>
				}
				{ id && media &&
					<Button onClick={ onRemoveFile } isLink isDestructive>
						{ removeLabel }
					</Button>
				}
			</BaseControl>
		);
	}

}

export default withSelect( ( select, ownProps ) => {
	const { getMedia } = select( 'gumponents/media' );
	const { value } = ownProps;

	return {
		getMedia: value ? getMedia( value ) : null,
	};
} )( withDispatch( ( dispatch, ownProps ) => {
	return {
		onSetMedia( media ) {
			dispatch( 'gumponents/media' ).setMedia( media );
		},
	};
} )( FileControl ) );

