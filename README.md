![GitHub Actions](https://github.com/junaidbhura/gumponents/workflows/Coding%20Standards%20and%20Tests/badge.svg)

<img src="https://user-images.githubusercontent.com/2512525/52129802-685f6200-2688-11e9-908e-494cabd016d9.png" width="600" alt="Gumponents!">

# Essential Gutenberg components for WordPress.

Gumponents offer some **crucial** missing Gutenberg components, essential to create advanced blocks. 🚀

Individual Gumponents aim to be deprecated over time, when components similar or better land in WordPress core.

They are not blocks, but rather, what you would use to build advanced blocks.

## Quick Links

[Documentation](https://github.com/junaidbhura/gumponents/wiki) | [Roadmap](https://github.com/junaidbhura/gumponents/projects/1)

## Components

### PostRelationshipControl

![post-relationship-control](https://user-images.githubusercontent.com/2512525/52121336-368dd180-266f-11e9-9cdd-37317a83a7e3.gif)

#### Example

```js
import { PostRelationshipControl } = gumponents.components;

<PostRelationshipControl
	label="Select people"
	help="Select people"
	postTypes="people"
	taxonomies={ [ { people_roles: [ 'ceo', 'management' ] } ] }
	value={ people.map( person => person.ID ) }
	onSelect={ people => setAttributes( { people } ) }
	buttonLabel="Select People"
	filter="people_meta"
	max="1"
/>
```

### TaxonomyRelationshipControl

![taxonomy-relationship-control](https://user-images.githubusercontent.com/2512525/52122521-342d7680-2673-11e9-88d7-f15f33245d86.gif)

#### Example

```js
import { TaxonomyRelationshipControl } = gumponents.components;

<TaxonomyRelationshipControl
	label="Select people roles"
	taxonomies="people_roles"
	value={ taxonomy.map( tax => tax.term_id ) }
	onSelect={ taxonomy => setAttributes( { taxonomy } ) }
	buttonLabel="Select People Roles"
	filter="people_meta"
	max="1"
/>
```

### MultiSelectControl

![multi-select-control](https://user-images.githubusercontent.com/2512525/56482870-83ae7080-6505-11e9-9ec6-9815818b4d38.gif)

#### Example

```js
import { MultiSelectControl } = gumponents.components;

...

attributes: {
	simpsons: {
		type: 'array',
		default: [],
	},
},

...

const options = [
	{ value: 'bart', label: 'Bart' },
	{ value: 'homer', label: 'Homer' },
	{ value: 'marge', label: 'Marge' },
];

<MultiSelectControl
	label="Choose Simpsons"
	help="Choose your favorite characters."
	options={ options }
	value={ attributes.simpsons }
	onChange={ ( simpsons ) => setAttributes( { simpsons } ) }
	placeholder="D'oh"
/>
```

### LinkControl

![link-control](https://user-images.githubusercontent.com/2512525/56483259-e99bf780-6507-11e9-86ce-d905f5bbc74b.gif)

#### Example

```js
import { LinkControl } = gumponents.components;

...

attributes: {
	link: {
		type: 'object',
		default: {},
	},
},

...

<LinkControl
	label="Select URL"
	value={ attributes.link }
	onChange={ ( link ) => setAttributes( { link } ) }
	help="Enter a URL."
/>
```

### FileControl

![file-control](https://user-images.githubusercontent.com/2512525/52123616-9c318c00-2676-11e9-910e-15daf6e144da.gif)

#### Example

```js
import { FileControl } = gumponents.components;

...

attributes: {
	file: {
		type: 'object',
		default: null,
	},
},

...

<FileControl
	label="Choose file"
	selectLabel="Choose video"
	removeLabel="Remove this video"
	onChange={ file => setAttributes( { file: file ? { id: file.id, name: file.filename } : null } ) }
	value={ file ? file.id : null }
/>
```

### ImageControl

![image-control](https://user-images.githubusercontent.com/2512525/52124187-583f8680-2678-11e9-8119-fbf842b88848.gif)

#### Example

```js
import { ImageControl } = gumponents.components;

...

attributes: {
	image: {
		type: 'object',
		default: null,
	},
},

...

<ImageControl
	label="Choose image"
	selectLabel="Choose image"
	removeLabel="Remove this image"
	size="thumbnail"
	value={ image }
	onChange={ ( image, media ) => setAttributes( { image } ) }
/>
```

### GalleryControl

![gallery-control](https://user-images.githubusercontent.com/2512525/58150817-2136c480-7cab-11e9-86b6-19c3a544d831.gif)

#### Example

```js
import { GalleryControl } = gumponents.components;

...

attributes: {
	gallery: {
		type: 'array',
		default: [],
	},
},

...

<GalleryControl
	size="medium"
	onSelect={ ( gallery, media ) => {
		setAttributes( { gallery: null } ); // The block editor doesn't update arrays correctly? 🤷‍♂️
		setAttributes( { gallery } );
	} }
	value={ attributes.gallery }
/>
```

### SelectImage

![select-image](https://user-images.githubusercontent.com/2512525/53619432-5220d380-3c3f-11e9-8a93-d0504d9fc9ee.gif)

#### Example

```js
import { SelectImage } = gumponents.components;

...

attributes: {
	image: {
		type: 'object',
		default: null,
	},
},

...

<SelectImage
	image={ image }
	placeholder="Choose an image"
	size="full"
	onChange={ ( image, media ) => {
		setAttributes( { image: null } ); // The block editor doesn't update objects correctly? 🤷‍♂️
		setAttributes( { image } );
	} }
	showCaption={ false }
/>
```
