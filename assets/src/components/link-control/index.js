import './editor.scss';

import React, { Component } from 'react';
import wp from 'wp';
import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';

const { __ } = wp.i18n;

const {
	BaseControl,
	Icon,
} = wp.components;

const {
	URLInput,
} = wp.editor;

const {
	Modal,
	Button,
	TextControl,
	ToggleControl,
} = wp.components;

class LinkControl extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			url: '',
			text: '',
			newWindow: false,
			modalOpen: false,
		};
	}

	componentDidMount() {
		if ( this.props.value ) {
			if ( isObject( this.props.value ) ) {
				if ( ! isEmpty( this.props.value ) ) {
					this.setState( omit( this.props.value, [ 'modalOpen' ] ) );
				}
			} else {
				this.setState( { url: this.props.value } );
			}
		}
	}

	componentDidUpdate( prevProps, prevState ) {
		if ( this.props.onChange && ! isEqual( prevState, this.state ) ) {
			this.props.onChange( omit( this.state, [ 'modalOpen' ] ) );
		}
	}

	render() {
		const { label, help } = this.props;
		let { buttonLabel, modalTitle } = this.props;

		if ( ! buttonLabel ) {
			buttonLabel = __( 'Select' );
		}
		if ( ! modalTitle ) {
			modalTitle = __( 'URL' );
		}

		return (
			<BaseControl
				label={ label }
				help={ help }
				className="gumponents-link-control"
			>
				<Button
					isDefault
					onClick={ () => this.setState( { modalOpen: true } ) }
				>
					{ buttonLabel }
				</Button>
				{ '' !== this.state.url &&
					<div className="gumponents-link-control__preview">
						<a
							href={ this.state.url }
							target="_blank"
							rel="noopener noreferrer"
						>
							{ '' === this.state.text && this.state.url }
							{ '' !== this.state.text && this.state.text }
							{ false !== this.state.newWindow &&
								<Icon
									icon="external"
									size={ 15 }
								/>
							}
						</a>
					</div>
				}
				{ this.state.modalOpen &&
					<Modal
						title={ modalTitle }
						shouldCloseOnClickOutside={ false }
						className="gumponents-link-control__modal"
						onRequestClose={ () => this.setState( { modalOpen: false } ) }
					>
						<BaseControl
							label={ __( 'URL' ) }
							className="gumponents-url-control"
						>
							<URLInput
								value={ this.state.url }
								onChange={ ( url, post ) => {
									if ( this.props.onUrl ) {
										this.props.onUrl( url, post );
									}
									this.setState( { url } );
									if ( post && '' === this.state.text ) {
										this.setState( {
											text: post.title,
										} );
									} else if ( '' === url ) {
										this.setState( {
											text: '',
											newWindow: false,
										} );
									}
								} }
							/>
						</BaseControl>
						<TextControl
							label={ __( 'Link Text' ) }
							value={ this.state.text }
							onChange={ ( text ) => this.setState( { text } ) }
						/>
						<ToggleControl
							label={ __( 'New Tab' ) }
							help={ __( 'Open link in a new tab?' ) }
							checked={ this.state.newWindow }
							onChange={ () => this.setState( { newWindow: ! this.state.newWindow } ) }
						/>
					</Modal>
				}
			</BaseControl>
		);
	}
}

export default LinkControl;
