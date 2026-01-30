# Gumponents Migration Roadmap

Migration from legacy JavaScript/PHP architecture to TypeScript + modern WordPress standards, under the Aysnc alias.

---

## Phase 1: Project Scaffolding & Configuration ✅

Set up the new project structure and tooling before touching any source code.

### 1.1 Directory Structure

Create the new directory layout:

```
gumponents/
├── src/                          # PHP source (PSR-4 root)
│   ├── Plugin.php                # Main plugin class
│   └── RestApi/
│       ├── MediaController.php
│       └── Relationship/
│           ├── Controller.php
│           ├── PostsController.php
│           └── TaxonomiesController.php
├── resources/                    # TypeScript + SCSS source
│   ├── index.ts                  # Entry point
│   ├── types/                    # Shared TypeScript types/interfaces
│   ├── data/                     # WordPress data stores
│   │   ├── media.ts
│   │   └── relationship.ts
│   └── components/               # React components (mirrors current)
│       ├── color-palette-control/
│       │   ├── index.tsx
│       │   └── editor.scss
│       ├── figure/
│       ├── file-control/
│       ├── focal-point-picker-control/
│       ├── gallery-control/
│       ├── image-control/
│       ├── img/
│       ├── link-button/
│       ├── link-control/
│       ├── multiselect-control/
│       ├── post-relationship-control/
│       ├── relationship/
│       │   ├── index.tsx
│       │   ├── selector.tsx
│       │   ├── search-items.tsx
│       │   ├── selected-items.tsx
│       │   └── editor.scss
│       ├── relationship-control/
│       ├── search-link-control/
│       ├── select-image/
│       └── taxonomy-relationship-control/
├── build/                        # wp-scripts output (gitignored)
├── tests/                        # PHPUnit tests
│   ├── bootstrap.php
│   └── ...
├── gumponents.php                # Plugin entry point (rewritten)
├── composer.json                 # New
├── package.json                  # New
├── tsconfig.json                 # New
├── webpack.config.js             # wp-scripts override (entry point only)
├── phpstan.neon                  # New
├── phpcs.xml                     # New
├── .php-cs-fixer.dist.php        # New
├── .editorconfig                 # New
├── .wp-env.json                  # New
├── .eslintrc.js                  # New (TypeScript + WordPress ESLint)
├── .stylelintrc.json             # New (WordPress SCSS linting)
├── .prettierrc.js                # New (WordPress Prettier config)
├── .gitignore                    # Updated
└── .github/
    └── workflows/
        └── test.yml              # CI/CD
```

### 1.2 composer.json

```json
{
  "name": "aysnc/gumponents",
  "description": "Essential Gutenberg components for WordPress.",
  "type": "wordpress-plugin",
  "license": "MIT",
  "authors": [
    {
      "name": "Aysnc",
      "homepage": "https://aysnc.dev"
    }
  ],
  "autoload": {
    "psr-4": {
      "Aysnc\\WordPress\\Gumponents\\": "src",
      "Aysnc\\WordPress\\Gumponents\\Tests\\": "tests"
    }
  },
  "require": {
    "php": "^8.3"
  },
  "require-dev": {
    "aysnc/wordpress-php-cs-fixer": "^0.3.0",
    "aysnc/wordpress-phpcs": "^0.1.0",
    "squizlabs/php_codesniffer": "^3.13.5",
    "phpstan/phpstan": "^2.1",
    "roots/wordpress": "*",
    "phpunit/phpunit": "^9.6",
    "yoast/phpunit-polyfills": "^2.0",
    "wp-phpunit/wp-phpunit": "^6.9"
  },
  "scripts": {
    "lint": "phpcs",
    "format": "vendor/bin/php-cs-fixer fix",
    "static-analysis": "phpstan analyse -c phpstan.neon --memory-limit=512M"
  },
  "config": {
    "allow-plugins": {
      "dealerdirect/phpcodesniffer-composer-installer": true,
      "roots/wordpress-core-installer": true
    }
  }
}
```

### 1.3 package.json

```json
{
  "name": "gumponents",
  "description": "Essential Gutenberg components for WordPress.",
  "author": "Aysnc",
  "license": "MIT",
  "scripts": {
    "start": "composer install && npm ci && npm run wp-env start",
    "build": "wp-scripts build --webpack-src-dir=resources",
    "dev": "wp-scripts start --webpack-src-dir=resources",
    "lint:js": "wp-scripts lint-js resources/",
    "lint:css": "wp-scripts lint-style resources/",
    "lint:php": "composer lint",
    "format": "wp-scripts format resources/",
    "format:php": "composer format",
    "static-analysis:php": "composer static-analysis",
    "typecheck": "tsc --noEmit",
    "test:php": "wp-env run tests-cli --env-cwd=wp-content/plugins/gumponents ./vendor/bin/phpunit",
    "test:php:setup": "wp-env run tests-cli --env-cwd=wp-content/plugins/gumponents composer install && npm run test:php",
    "lint:test": "npm run lint:js && npm run lint:css && npm run lint:php && npm run typecheck && npm run test:php:setup && npm run static-analysis:php",
    "wp-env": "wp-env"
  },
  "devDependencies": {
    "@wordpress/env": "^10.36.0",
    "@wordpress/scripts": "^30.0.0",
    "@types/wordpress__block-editor": "*",
    "@types/wordpress__components": "*",
    "@types/wordpress__compose": "*",
    "@types/wordpress__data": "*",
    "@types/wordpress__element": "*"
  },
  "dependencies": {
    "@dnd-kit/core": "^6.0.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@dnd-kit/utilities": "^3.0.0",
    "@wordpress/api-fetch": "*",
    "@wordpress/block-editor": "*",
    "@wordpress/components": "*",
    "@wordpress/compose": "*",
    "@wordpress/data": "*",
    "@wordpress/element": "*",
    "@wordpress/html-entities": "*",
    "@wordpress/i18n": "*",
    "classnames": "^2.5.0",
    "react-select": "^5.8.0"
  }
}
```

**Notes:**
- `@wordpress/*` packages are listed as dependencies so TypeScript can resolve imports, but wp-scripts will externalize them at build time (they load from WordPress core at runtime)
- `@dnd-kit/*` replaces `react-beautiful-dnd` (unmaintained)
- All build tooling (webpack, babel, typescript, sass) is provided by `@wordpress/scripts`
- `lodash` removed entirely

### 1.4 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es2017",
    "module": "esnext",
    "moduleResolution": "node",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "build",
    "rootDir": "resources",
    "declaration": true,
    "declarationDir": "build/types",
    "noEmit": true,
    "resolveJsonModule": true,
    "isolatedModules": true
  },
  "include": ["resources/**/*"],
  "exclude": ["node_modules", "build"]
}
```

### 1.5 webpack.config.js

Minimal override of wp-scripts defaults to set the custom entry directory:

```js
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
	...defaultConfig,
	entry: './resources/index.ts',
};
```

**Note:** wp-scripts handles TypeScript, SCSS extraction, WordPress externals, and `.asset.php` generation automatically.

### 1.6 Quality Tooling Config Files

**phpstan.neon** — mirrors reference plugin pattern:
```yaml
parameters:
  level: max
  scanFiles:
    - gumponents.php
  scanDirectories:
    - vendor
    - wordpress
    - vendor/wp-phpunit
  paths:
    - src
    - tests
  excludePaths:
    - wordpress/wp-admin/includes/noop.php
```

**phpcs.xml:**
```xml
<?xml version="1.0"?>
<ruleset name="WordPress Coding Standards">
  <rule ref="Aysnc-WordPress"/>
  <file>./gumponents.php</file>
  <file>./src</file>
</ruleset>
```

**.php-cs-fixer.dist.php:**
```php
<?php
use Aysnc\WordPress\PHPCSFixer\Config;
use PhpCsFixer\Finder;

require_once __DIR__ . '/vendor/autoload.php';

$finder = Finder::create()
    ->in( [ __DIR__ . '/src' ] );

return Config::create()->setFinder( $finder );
```

**.editorconfig** — matches reference plugin:
```
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = tab

[{.jshintrc,*.json,*.yml}]
indent_style = space
indent_size = 2

[{*.txt,wp-config-sample.php}]
end_of_line = crlf
```

**.wp-env.json:**
```json
{
  "phpVersion": "8.3",
  "plugins": ["."]
}
```

### 1.7 JavaScript / CSS Lint & Format Config

wp-scripts bundles ESLint, Stylelint, and Prettier with WordPress-specific configurations. We need config files so the tools pick up the right presets and work with TypeScript + SCSS.

#### How it works under the hood

| Command | Tool | Bundled Config Package |
|---------|------|----------------------|
| `wp-scripts lint-js` | ESLint | `@wordpress/eslint-plugin` (includes TypeScript support) |
| `wp-scripts lint-style` | Stylelint | `@wordpress/stylelint-config` |
| `wp-scripts format` | Prettier | `@wordpress/prettier-config` (WordPress's own Prettier preset) |

All three are bundled as dependencies of `@wordpress/scripts` — no extra installs needed.

#### .eslintrc.js

```js
const defaultConfig = require( '@wordpress/scripts/config/.eslintrc' );

module.exports = {
	...defaultConfig,
	rules: {
		...defaultConfig.rules,
		'no-shadow': 'off',
		'@wordpress/no-base-control-with-label-without-id': 'off',
	},
};
```

**Notes:**
- Extends wp-scripts' default ESLint config (which includes `@wordpress/eslint-plugin/recommended-with-formatting`)
- TypeScript linting works automatically — `@wordpress/eslint-plugin` bundles `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin`
- The `recommended-with-formatting` preset enforces Prettier formatting rules through ESLint (so `lint-js` catches both code quality AND formatting issues)
- Override rules carried over from the old `.eslintrc.json` where still needed

#### .stylelintrc.json

```json
{
	"extends": "@wordpress/stylelint-config/scss"
}
```

**Notes:**
- The `/scss` variant includes all WordPress CSS rules plus SCSS-specific rules
- Bundled in `@wordpress/scripts` — no separate install
- Lints all `.scss` and `.css` files in `resources/`

#### .prettierrc.js

```js
const defaultConfig = require( '@wordpress/prettier-config' );

module.exports = defaultConfig;
```

**Notes:**
- WordPress Prettier config enforces WordPress formatting conventions (tab indentation, single quotes, trailing commas, paren spacing via `wp-prettier`)
- `wp-scripts format resources/` will format `.ts`, `.tsx`, `.scss`, `.json` files
- The ESLint config's `recommended-with-formatting` preset includes `eslint-plugin-prettier`, so formatting violations also show up in `lint-js` output — this means `lint:js` catches both lint errors and formatting issues in one pass
- Running `format` auto-fixes formatting; `lint:js` reports formatting violations as errors

### 1.8 .gitignore Update

```
node_modules/
vendor/
build/
wordpress/
.phpunit.result.cache
```

### 1.9 Delete Legacy Tooling

Remove these files that are replaced by the new setup:
- `webpack.config.js` (old custom webpack — replaced by wp-scripts override)
- `.eslintrc.json` (replaced by `.eslintrc.js` extending wp-scripts config)
- `.stylelintrc` if present (replaced by `.stylelintrc.json` with WordPress SCSS preset)
- `inc/autoload.php` (replaced by Composer PSR-4)

---

## Phase 2: PHP Migration ✅

Rewrite all PHP under the new namespace and standards. All REST API routes, hook names, and filter names remain unchanged for backwards compatibility.

### 2.1 Plugin Entry Point — `gumponents.php`

Rewrite to match reference plugin pattern:

```php
<?php
/**
 * Plugin Name: Gumponents
 * Description: Essential Gutenberg components for WordPress.
 * Version: 2.0.0
 * Text Domain: gumponents
 * Author: Aysnc
 * Author URI: https://aysnc.dev
 *
 * @package aysnc/gumponents
 */

declare( strict_types = 1 );

namespace Aysnc\WordPress\Gumponents;

// Composer autoloader.
if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
    require_once __DIR__ . '/vendor/autoload.php';
}

// Bootstrap the plugin.
add_action( 'plugins_loaded', [ Plugin::class, 'bootstrap' ] );
```

**Key changes:**
- `declare(strict_types = 1)`
- Namespace `JB\Gumponents` → `Aysnc\WordPress\Gumponents`
- Composer autoloader replaces custom autoloader
- `Plugin::bootstrap()` replaces procedural `setup()` function
- Author changed to Aysnc

### 2.2 Plugin Class — `src/Plugin.php`

New static class consolidating logic from `inc/namespace.php`:

```php
<?php
declare( strict_types = 1 );

namespace Aysnc\WordPress\Gumponents;

class Plugin {
    public static function bootstrap(): void {
        add_action( 'enqueue_block_assets', [ __CLASS__, 'enqueue_editor_assets' ] );
        add_action( 'rest_api_init', [ __CLASS__, 'register_rest_endpoints' ] );
    }

    public static function enqueue_editor_assets(): void {
        // Only in admin
        // Use build/index.asset.php for dependencies (generated by wp-scripts)
        // Enqueue build/index.js as 'gumponents-blocks'  ← keep handle for BC
        // Enqueue build/index.css as 'gumponents'  ← keep handle for BC
    }

    public static function register_rest_endpoints(): void {
        new RestApi\Relationship\PostsController();
        new RestApi\Relationship\TaxonomiesController();
        new RestApi\MediaController();
    }
}
```

**Important change in `enqueue_editor_assets`:**
- wp-scripts generates `build/index.asset.php` containing `[ 'dependencies' => [...], 'version' => '...' ]`
- Use this instead of the hardcoded dependency array
- This ensures `@wordpress/*` imports are automatically registered as WordPress script dependencies
- Script handle stays `gumponents-blocks` for BC (other plugins may depend on it)
- Style handle stays `gumponents` for BC
- Remove the `lodash` dependency (no longer used)
- Remove the conditional `wp-editor`/`wp-edit-post` logic (wp-scripts asset file handles this automatically based on actual imports)

### 2.3 REST API Controllers — `src/RestApi/`

Migrate each controller:

| Old Path | New Path |
|----------|----------|
| `inc/rest-api/class-media-controller.php` | `src/RestApi/MediaController.php` |
| `inc/rest-api/relationship/class-controller.php` | `src/RestApi/Relationship/Controller.php` |
| `inc/rest-api/relationship/class-posts-controller.php` | `src/RestApi/Relationship/PostsController.php` |
| `inc/rest-api/relationship/class-taxonomies-controller.php` | `src/RestApi/Relationship/TaxonomiesController.php` |

**Changes per file:**
- Add `declare(strict_types = 1)`
- Change namespace from `JB\Gumponents\RestApi\*` → `Aysnc\WordPress\Gumponents\RestApi\*`
- Add typed parameters and return types to all methods
- Add PHPDoc with `@var` array shapes where applicable
- **Keep all REST route namespaces as-is** (e.g., `gumponents/media/v1`, `gumponents/relationship/v1`)
- **Keep all filter/hook names as-is** (e.g., `gumponents_attachment_rest_permission`, `gumponents_posts_relationship_query`, etc.)
- Rename file naming convention from `class-*.php` to `ClassName.php` (PSR-4)

### 2.4 Delete Legacy PHP

After migration, remove:
- `inc/` directory entirely (autoload.php, namespace.php, rest-api/)

---

## Phase 3: TypeScript Foundation ✅

Set up the TypeScript infrastructure, types, and data stores before migrating components.

### 3.1 Shared Types — `resources/types/`

Define TypeScript interfaces used across the plugin:

```typescript
// resources/types/index.ts

export interface RelationshipItem {
    id: number;
    value: WP_Post | WP_Term | Record<string, unknown>;
    label: string;
    permalink?: string;
}

export interface MediaItem {
    id: number;
    sizes: Record<string, { width: number; height: number; url: string }>;
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
```

### 3.2 Data Store: Media — `resources/data/media.ts`

Rewrite using modern `@wordpress/data` API:

**Changes from current:**
- `import { createReduxStore, register } from '@wordpress/data'` replaces `registerStore` (deprecated)
- `import apiFetch from '@wordpress/api-fetch'` replaces `wp.apiFetch`
- Replace `lodash/unionWith` + `lodash/isEqual` with native dedup-by-ID logic
- Replace `lodash/isObject` with `typeof x === 'object' && x !== null`
- Add full TypeScript types for state, actions, selectors
- **Keep store name `gumponents/media`** for BC

### 3.3 Data Store: Relationship — `resources/data/relationship.ts`

Same modernization as media store:

**Changes from current:**
- `createReduxStore` + `register` instead of `registerStore`
- `apiFetch` import instead of `wp.apiFetch`
- Native array dedup replacing lodash `unionWith`/`isEqual`
- Full TypeScript typing
- **Keep store name `gumponents/relationship`** for BC
- **Keep all REST API paths** (`/gumponents/relationship/v1/...`)

### 3.4 Lodash Replacement Utilities

Replace all lodash functions with native equivalents. No utility file needed — use inline:

| Lodash | Native Replacement |
|--------|--------------------|
| `unionWith(arr1, arr2, isEqual)` | Dedup by `id`: `[...arr, ...newItems.filter(n => !arr.some(e => e.id === n.id))]` |
| `isEqual(a, b)` | Not needed — dedup by `id` instead |
| `isObject(x)` | `typeof x === 'object' && x !== null` |
| `has(obj, key)` | `key in obj` or optional chaining |
| `isEmpty(x)` | `!x` or `x.length === 0` or `Object.keys(x).length === 0` |
| `isString(x)` | `typeof x === 'string'` |
| `debounce(fn, ms)` | Inline debounce utility (small helper function) or use `wp.compose.useDebounce` |

---

## Phase 4: Component Migration ✅

Convert each component from JavaScript to TypeScript, replacing `wp.*` global access with proper imports, and modernizing HOC patterns to hooks. All components keep their existing props interfaces for BC.

### Migration Pattern Per Component

Every component follows this transformation:

```typescript
// BEFORE (JavaScript)
import wp from 'wp';
const { __ } = wp.i18n;
const { Button } = wp.components;
const { useState } = wp.element;

// AFTER (TypeScript)
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
```

For HOC → hooks:
```typescript
// BEFORE
import { withSelect, withDispatch } from wp.data;
import { compose } from wp.compose;

export default compose(
    withSelect((select, ownProps) => ({
        data: select('gumponents/media').getMedia(ownProps.value),
    })),
    withDispatch((dispatch) => ({
        onSetMedia(media) { dispatch('gumponents/media').setMedia(media); },
    })),
)(MyComponent);

// AFTER
import { useSelect, useDispatch } from '@wordpress/data';

export default function MyComponent({ value, ...props }) {
    const data = useSelect(
        (select) => select('gumponents/media').getMedia(value),
        [value]
    );
    const { setMedia } = useDispatch('gumponents/media');
    // ...
}
```

### 4.1 Simple Components (No Store Dependencies)

These components only need import modernization and TypeScript typing.

#### 4.1.1 Img (`resources/components/img/index.tsx`)
- Replace `wp.element`, `wp.i18n` with `@wordpress/*` imports
- Replace `lodash/isEmpty`, `lodash/isString` with native checks
- Add props interface
- Replace `classnames` usage stays as-is (keeping the dependency)

#### 4.1.2 Figure (`resources/components/figure/index.tsx`)
- Replace `wp.*` imports
- Add props interface
- Depends on Img component

#### 4.1.3 ColorPaletteControl (`resources/components/color-palette-control/index.tsx`)
- Replace `wp.components`, `wp.data` imports
- Replace `withSelect` with `useSelect` (fetches color settings from block editor)
- Add props interface

#### 4.1.4 FocalPointPickerControl (`resources/components/focal-point-picker-control/index.tsx`)
- Replace `wp.components` imports
- Add props interface

#### 4.1.5 MultiSelectControl (`resources/components/multiselect-control/index.tsx`)
- Replace `wp.components` imports
- Keep `react-select` dependency (revisit later)
- Add props interface with react-select generic types

#### 4.1.6 LinkButton (`resources/components/link-button/index.tsx`)
- Replace `wp.*` imports
- Add props interface
- This component uses an internal `UrlModal` sub-component

#### 4.1.7 LinkControl (`resources/components/link-control/index.tsx`)
- Replace `wp.*` imports
- Add props interface

#### 4.1.8 SearchLinkControl (`resources/components/search-link-control/index.tsx`)
- Replace `wp.*` imports
- Replace `lodash/debounce` with native debounce or `wp.compose.useDebounce`
- Replace `wp.apiFetch` with `import apiFetch from '@wordpress/api-fetch'`
- Replace `wp.htmlEntities` with `import { decodeEntities } from '@wordpress/html-entities'`
- Add props interface

### 4.2 Media Components (Depend on Media Store)

These need HOC → hooks conversion plus TypeScript.

#### 4.2.1 ImageControl (`resources/components/image-control/index.tsx`)
- Replace `compose(withSelect, withDispatch)` with `useSelect`/`useDispatch` hooks
- Replace `lodash/has`, `lodash/isObject` with native checks
- Export both the component and the `getImageDetails` utility function (used by other components)
- Add props interface and ImageDetails type

#### 4.2.2 FileControl (`resources/components/file-control/index.tsx`)
- Replace `compose(withSelect, withDispatch)` with `useSelect`/`useDispatch` hooks
- Replace `lodash/has`, `lodash/isObject` with native checks
- Add props interface

#### 4.2.3 GalleryControl (`resources/components/gallery-control/index.tsx`)
- Replace `wp.*` imports
- Imports `getImageDetails` from ImageControl
- Add props interface

#### 4.2.4 SelectImage (`resources/components/select-image/index.tsx`)
- Replace `wp.*` imports
- Imports `getImageDetails` from ImageControl
- Add props interface

### 4.3 Relationship Components (Store + Drag & Drop)

The most complex migration. Involves replacing `react-beautiful-dnd` with `@dnd-kit`.

#### 4.3.1 SearchItems (`resources/components/relationship/search-items.tsx`)
- Replace `wp.*` imports
- Replace `classnames` usage stays
- Add props interface
- Straightforward conversion (no drag-drop, no store)

#### 4.3.2 SelectedItems (`resources/components/relationship/selected-items.tsx`)

**This is the key `react-beautiful-dnd` → `@dnd-kit` migration:**

```typescript
// BEFORE
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// AFTER
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
```

Migration mapping:
| react-beautiful-dnd | @dnd-kit |
|---------------------|----------|
| `<DragDropContext onDragEnd>` | `<DndContext onDragEnd collisionDetection={closestCenter}>` |
| `<Droppable droppableId>` | `<SortableContext items strategy={verticalListSortingStrategy}>` |
| `<Draggable draggableId index>` | `useSortable({ id })` hook on each item |
| `provided.innerRef` | `setNodeRef` from `useSortable` |
| `provided.draggableProps` | `attributes` + `listeners` from `useSortable` |
| `result.source.index` / `result.destination.index` | `event.active` / `event.over` with `arrayMove` |

Create a `SortableItem` sub-component that uses the `useSortable` hook internally.

The `onDragEnd` handler changes:
```typescript
// BEFORE
const onDragEnd = (result) => {
    if (!result.destination) return;
    const newItems = Array.from(items);
    const [removed] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, removed);
    onUpdated(newItems);
};

// AFTER
import { arrayMove } from '@dnd-kit/sortable';

const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((item) => `id-${item.id}` === active.id);
    const newIndex = items.findIndex((item) => `id-${item.id}` === over.id);
    onUpdated(arrayMove(items, oldIndex, newIndex));
};
```

#### 4.3.3 Selector (`resources/components/relationship/selector.tsx`)
- Replace `wp.*` imports
- Replace module-level `typingDelayTimeout` with `useRef`
- Add props interface

#### 4.3.4 Relationship (`resources/components/relationship/index.tsx`)
- Replace `wp.*` imports
- Add props interface

#### 4.3.5 PostRelationshipControl (`resources/components/post-relationship-control/index.tsx`)
- Replace `compose(withSelect, withDispatch)` with `useSelect`/`useDispatch`
- Replace `wp.apiFetch` with `import apiFetch from '@wordpress/api-fetch'`
- Add props interface

#### 4.3.6 TaxonomyRelationshipControl (`resources/components/taxonomy-relationship-control/index.tsx`)
- Same HOC → hooks conversion as PostRelationshipControl
- Add props interface

#### 4.3.7 RelationshipControl (`resources/components/relationship-control/index.tsx`)
- Same HOC → hooks conversion
- Add props interface

### 4.4 Entry Point — `resources/index.ts`

```typescript
// Register data stores.
import './data/relationship';
import './data/media';

// Import components.
import Img from './components/img';
import Figure from './components/figure';
// ... all 15 components

// Backwards-compatible global export.
window.gumponents = {
    components: {
        Img,
        Figure,
        // ... all 15 components
    },
};
```

Need to add a `global.d.ts` or augment the Window interface:
```typescript
// resources/types/global.d.ts
declare global {
    interface Window {
        gumponents: {
            components: Record<string, React.ComponentType<any>>;
        };
    }
}
```

---

## Phase 5: Build & Distribution Verification ✅

### 5.1 wp-scripts Build Verification

- Run `npm run build` and verify:
  - `build/index.js` is generated (replaces `assets/dist/blocks.js`)
  - `build/index.css` is generated (replaces `assets/dist/editor.css`)
  - `build/index.asset.php` is generated with correct dependencies
  - All `@wordpress/*` packages are externalized (not bundled)
  - `react-select`, `@dnd-kit/*`, `classnames` ARE bundled
  - No `lodash` in the bundle

### 5.2 PHP Asset Loading Verification

The `Plugin::enqueue_editor_assets()` method should:
- Read `build/index.asset.php` for dependencies and version
- Enqueue `build/index.js` with handle `gumponents-blocks`
- Enqueue `build/index.css` with handle `gumponents`
- Verify `window.gumponents.components` is populated with all 15 components

### 5.3 Backwards Compatibility Checklist

Verify each of these still works identically:

- [ ] `window.gumponents.components.Img` renders correctly
- [ ] `window.gumponents.components.PostRelationshipControl` loads initial items from store
- [ ] All REST API endpoints respond at their existing paths
- [ ] All PHP filters fire with the same arguments
- [ ] Script handle `gumponents-blocks` can be used as a dependency by other plugins
- [ ] Data stores `gumponents/media` and `gumponents/relationship` are accessible via `wp.data.select()`
- [ ] Drag & drop reordering works in relationship controls
- [ ] All SCSS renders the same (class names unchanged)

---

## Phase 6: Testing & CI ✅

### 6.1 PHPUnit Tests

Write tests for all REST API controllers:
- `tests/RestApi/MediaControllerTest.php`
- `tests/RestApi/Relationship/PostsControllerTest.php`
- `tests/RestApi/Relationship/TaxonomiesControllerTest.php`
- `tests/PluginTest.php` (bootstrap, asset enqueue)

Follow reference plugin patterns:
- Extend `WP_UnitTestCase`
- Use `yoast/phpunit-polyfills`
- Use `wp-phpunit` for WordPress test utilities
- Test all filterable hooks fire correctly
- Test permission callbacks

### 6.2 Static Analysis

- PHPStan at level max passes on all `src/` files
- PHPCS passes with Aysnc-WordPress ruleset
- PHP-CS-Fixer auto-formats correctly

### 6.3 TypeScript / JS / CSS Lint & Format Checks

- `npm run typecheck` — `tsc --noEmit` passes (type checking)
- `npm run lint:js` — `wp-scripts lint-js` passes (ESLint with WordPress rules + TypeScript rules + Prettier formatting enforcement)
- `npm run lint:css` — `wp-scripts lint-style` passes (Stylelint with WordPress SCSS rules)
- `npm run format` — `wp-scripts format` produces no diff (all files already formatted per WordPress Prettier config)

### 6.4 GitHub Actions CI/CD

`.github/workflows/test.yml`:
- Trigger: push to main, PRs to main
- Steps: checkout, setup node 20, setup PHP 8.3, install deps, start wp-env, run lint:test, stop wp-env

---

## Phase 7: Cleanup ✅

### 7.1 Remove Legacy Files

Once everything is verified:
- Delete `assets/` directory entirely (src/ and dist/)
- Delete `inc/` directory entirely
- Delete old `webpack.config.js` (replaced by new wp-scripts override)
- Delete old `.eslintrc.json` (replaced by `.eslintrc.js`)
- Delete old `.stylelintrc` if present (replaced by `.stylelintrc.json`)
- Delete old `phpunit.xml` if present (may need updating)
- Delete old `stylelint-config-wordpress` references from any config

### 7.2 Update Documentation

- Update README.md with:
  - New author (Aysnc)
  - New build commands (`npm run build`, `npm run dev`)
  - New PHP requirements (8.3+)
  - TypeScript information
  - Note about backwards compatibility

### 7.3 Version Bump

- Bump to version 2.0.0 (major version for the rewrite)
- Update `gumponents.php` header
- Update any version constants

---

## Future Considerations (Not In This Roadmap)

- **npm package publishing**: Export components as ES module package for direct import by other TypeScript projects
- **react-select replacement**: Evaluate core `ComboboxControl` / `FormTokenField` as alternatives
- **Component deprecation**: As WordPress core adds equivalent components, deprecate and document migration paths
- **Block.json registration**: If WordPress adds better support for component-only plugins
