/**
 * Gumponents Test Blocks.
 *
 * Registers one block per Gumponent component for e2e testing.
 */
import { registerBlockType } from '@wordpress/blocks';

import img from './blocks/img';
import figure from './blocks/figure';
import imageControl from './blocks/image-control';
import fileControl from './blocks/file-control';
import galleryControl from './blocks/gallery-control';
import selectImage from './blocks/select-image';
import focalPointPickerControl from './blocks/focal-point-picker-control';
import linkControl from './blocks/link-control';
import linkButton from './blocks/link-button';
import searchLinkControl from './blocks/search-link-control';
import multiselectControl from './blocks/multiselect-control';
import colorPaletteControl from './blocks/color-palette-control';
import postRelationshipControl from './blocks/post-relationship-control';
import taxonomyRelationshipControl from './blocks/taxonomy-relationship-control';
import relationshipControl from './blocks/relationship-control';

const blocks = [
	[ 'gumponents-test/img', img ],
	[ 'gumponents-test/figure', figure ],
	[ 'gumponents-test/image-control', imageControl ],
	[ 'gumponents-test/file-control', fileControl ],
	[ 'gumponents-test/gallery-control', galleryControl ],
	[ 'gumponents-test/select-image', selectImage ],
	[ 'gumponents-test/focal-point-picker-control', focalPointPickerControl ],
	[ 'gumponents-test/link-control', linkControl ],
	[ 'gumponents-test/link-button', linkButton ],
	[ 'gumponents-test/search-link-control', searchLinkControl ],
	[ 'gumponents-test/multiselect-control', multiselectControl ],
	[ 'gumponents-test/color-palette-control', colorPaletteControl ],
	[ 'gumponents-test/post-relationship-control', postRelationshipControl ],
	[ 'gumponents-test/taxonomy-relationship-control', taxonomyRelationshipControl ],
	[ 'gumponents-test/relationship-control', relationshipControl ],
] as const;

for ( const [ name, config ] of blocks ) {
	registerBlockType( name, config as any );
}
