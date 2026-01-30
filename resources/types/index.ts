export interface RelationshipItem {
	id: number;
	value: WP_Post | WP_Term | Record< string, unknown >;
	label: string;
	permalink?: string;
}

export interface MediaItem {
	id: number;
	sizes: Record< string, { width: number; height: number; url: string } >;
	alt: string;
	caption: string;
	title: string;
}

export interface ImageDetails {
	id: number;
	src: string;
	width: number;
	height: number;
	alt: string;
	caption: string;
	title: string;
	size: string;
}

export interface WP_Post {
	ID: number;
	post_title: string;
	post_status: string;
	post_type: string;
	[ key: string ]: unknown;
}

export interface WP_Term {
	term_id: number;
	name: string;
	slug: string;
	taxonomy: string;
	[ key: string ]: unknown;
}
