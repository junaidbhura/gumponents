import './editor.scss';

import wp from 'wp';

const { __ } = wp.i18n;
const {
	Modal,
	Button,
	BaseControl,
	Icon,
} = wp.components;
const {
	useState,
} = wp.element;

function IconPickerControl( { value, help, modalTitle = __( 'Select Icon' ), label = __( 'Select icon' ), buttonLabel = __( 'Select icon' ), removeLabel = __( 'Remove icon' ) } ) {
	const [ modalOpen, setModalOpen ] = useState( true );

	/**
	 * Open modal.
	 */
	const openModal = () => {
		setModalOpen( true );
	};

	return (
		<>
			<BaseControl
				help={ help }
				label={ label }
				className="gumponents-icon-picker-control"
			>
				<Button
					isSecondary
					onClick={ openModal }
				>
					{ buttonLabel }
				</Button>

				{ value &&
					<Button onClick={ null } isLink isDestructive>
						{ removeLabel }
					</Button>
				}
			</BaseControl>
			{ modalOpen &&
				<Modal
					title={modalTitle}
					className="gumponents-icon-picker-control__modal"
					onRequestClose={() => setModalOpen(false)}
				>
					<div className="gumponents-icon-picker-control__icons">
						<div className="gumponents-icon-picker-control__icon" role="button">
							<Icon
								icon={() => (
									<svg>
										<path d="M5 4v3h5.5v12h3V7H19V4z"/>
									</svg>
								)}
							/>
						</div>
						<div className="gumponents-icon-picker-control__icon" role="button">
							<Icon
								icon={() => (
									<svg>
										<path d="M5 4v3h5.5v12h3V7H19V4z"/>
									</svg>
								)}
							/>
						</div>
						<div className="gumponents-icon-picker-control__icon" role="button">
							<Icon
								icon={() => (
									<svg>
										<path d="M5 4v3h5.5v12h3V7H19V4z"/>
									</svg>
								)}
							/>
						</div>
						<div className="gumponents-icon-picker-control__icon" role="button">
							<Icon
								icon={() => (
									<svg>
										<path d="M5 4v3h5.5v12h3V7H19V4z"/>
									</svg>
								)}
							/>
						</div>
						<div className="gumponents-icon-picker-control__icon" role="button">
							<Icon
								icon={() => (
									<svg>
										<path d="M5 4v3h5.5v12h3V7H19V4z"/>
									</svg>
								)}
							/>
						</div>
						<div className="gumponents-icon-picker-control__icon" role="button">
							<Icon
								icon={() => (
									<svg>
										<path d="M5 4v3h5.5v12h3V7H19V4z"/>
									</svg>
								)}
							/>
						</div>
						<div className="gumponents-icon-picker-control__icon" role="button">
							<Icon
								icon={() => (
									<svg>
										<path d="M5 4v3h5.5v12h3V7H19V4z"/>
									</svg>
								)}
							/>
						</div>
					</div>
					<div className="gumponents-icon-picker-control__buttons">
						<Button
							isDefault
							onClick={ () => setModalOpen( false ) }
						>
							Select
						</Button>
					</div>
				</Modal>
			}
		</>
	);
}

export default IconPickerControl;

