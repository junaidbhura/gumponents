import type { ComponentType } from '@wordpress/element';

declare global {
	interface Window {
		gumponents: {
			components: Record< string, ComponentType< any > >;
		};
	}
}
