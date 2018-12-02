<img src="https://user-images.githubusercontent.com/2512525/49289206-01d88f00-f4f3-11e8-8a79-efe8e5a2fcb4.png" width="600" alt="Gumponents!">

# Super userful Gutenberg components for WordPress.

Gumponents are a bunch of Gutenberg components, built in React, which are meant to be used by WordPress developers while building Gutenberg blocks.

They are not blocks, rather, what you would use to build advanced blocks.

**Please note**: Gumponents may be depracated over time, if something similar or better lands in WordPress core! It is still in beta, so please use accordingly!

## Usage

Download and enable this plugin. You now have Gumponents! 🎉

Make sure to add `gumponents` as a dependency when you're enqueueing your editor assets:

```php
wp_enqueue_script(
    'your-script',
    plugins_url( 'path/to/blocks.js', __FILE__ ),
    array(
        ...
        'gumponents', // That!
        ...
    ),
);
```

When you do this, you get a global `gumponents` object to use in your JavaScript like so:

```js
const { PostRelationshipControl } = gumponents.components;
```

## Components

Here are the components that are currently part of this bundle, with more on the way.

### Relationship

Choose post types or taxonomies to relate to your post!

![Relationship - Posts](https://user-images.githubusercontent.com/2512525/49289288-449a6700-f4f3-11e8-8ac3-2b56b72c7e41.gif)

#### Post type usage

An example of getting all posts in a custom post type `post` with associated taxonomy terms.

```js
<PostRelationshipControl
    postTypes="people"
    taxonomies={ [ { people_roles: [ 'ceo', 'management' ] } ] }
    value={ people.map( person => person.ID ) }
    onSelect={ people => setAttributes( { people } ) }
    buttonLabel="Select People"
    help="Select people"
    filter="people_meta"
/>
```

Notice that `filter` property? You can pass a custom filter to customize the results!

The value of the filter property get's appended to two filters:

#### `gumponents_posts_relationship_query`
This filters the `WP_Query` before executing it.

#### `gumponents_posts_relationship_results`
This filters the results before sending it to the editor.

For example:

```php
add_filter( 'gumponents_posts_relationship_results_people_meta', function ( $results ) {
	if ( ! empty( $results ) ) {
		foreach ( $results as $key => $result ) {
			$results[ $key ]['value']->post_meta = array(
				'designation' => get_post_meta( $result['id'], 'designation', true ),
			);
		}
	}
	return $results;
} );
```

You now have post meta along with the posts to work with in the editor 😎

![Relationship - Taxonomy](https://user-images.githubusercontent.com/2512525/49289292-46642a80-f4f3-11e8-8fe7-2b620c86ffd4.gif)

#### Taxonomy usage

An example of getting all taxonomy terms in a custom taxonomy:

```js
<TaxonomyRelationshipControl
    minimal
    taxonomies="people_roles"
    value={ taxonomy }
    onSelect={ taxonomy => {
        setAttributes( {
            taxonomy: taxonomy.map( tax => tax.term_id ),
        } );
    } }
/>
```

Notice the `minimal` property? That's if you just want the button, without the selected items displayed!

### SelectImage

This provides an easy way to select and work with images in the editor. (More documentation to follow)

Example usage:

```js
<SelectImage
    placeholder="Select an image"
/>
``` 
