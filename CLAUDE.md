# Gumponents - Project Memory

## Project Overview

Gumponents is a WordPress plugin providing Gutenberg block editor components for developers. It's a component library (not blocks) with 15 reusable components for media, relationships, forms, and UI.

**Current state:** Legacy plugin being migrated to new standards. No implementation started yet — planning phase complete.
**New author alias:** Aysnc (not a typo)
**Roadmap:** See `ROADMAP.md` in this repo for the full 7-phase implementation plan (scaffolding → PHP migration → TS foundation → component migration → build verification → testing/CI → cleanup).
**Reference plugin:** `/Users/junaid/Work/wordpress-dynamic-media` — PHP-only WordPress plugin used as the coding standard reference.

---

## Current Architecture (Legacy - "Gumponents")

### PHP
- **Namespace:** `JB\Gumponents`
- **Autoloader:** Custom PSR-4-like autoloader in `inc/autoload.php`
- **Entry point:** `gumponents.php` → `inc/namespace.php` (setup function)
- **REST API:** 3 controllers (Media, Posts, Taxonomies) under `inc/rest-api/`
- **No strict types**, no PHPStan, no PHP CS Fixer

### JavaScript (No TypeScript)
- **Build:** Custom webpack 5 config with Babel (preset-env, react-jsx)
- **Entry:** `assets/src/index.js` → `assets/dist/blocks.js`
- **CSS:** SCSS per component → `assets/dist/editor.css` (MiniCssExtractPlugin)
- **WordPress packages:** Accessed via `wp` global (e.g., `wp.i18n`, `wp.element`, `wp.components`)
- **Export:** All components exposed via `window.gumponents` global
- **Patterns:** Functional components with hooks, but uses legacy `compose`/`withSelect`/`withDispatch` HOC pattern for data access
- **Third-party deps:** react-select, react-beautiful-dnd, classnames, lodash

### Components (15 total)
| Component | Category | Description |
|-----------|----------|-------------|
| Img | UI | Responsive image renderer |
| Figure | UI | Figure wrapper with caption |
| ImageControl | Media | Single image selector with preview |
| FileControl | Media | File picker with details |
| GalleryControl | Media | Multi-image gallery selector |
| SelectImage | Media | Enhanced image selector with edit modal |
| FocalPointPickerControl | Media | Visual focal point picker |
| LinkControl | Link | URL selector with modal |
| LinkButton | Link | Button that opens URL modal |
| SearchLinkControl | Link | Search & select URLs with suggestions |
| MultiSelectControl | Form | Multi-select dropdown (wraps react-select) |
| ColorPaletteControl | Form | Theme color palette picker |
| PostRelationshipControl | Relationship | Post selector with search/filter/drag-drop |
| TaxonomyRelationshipControl | Relationship | Taxonomy term selector |
| RelationshipControl | Relationship | Generic relationship selector |

### Data Stores (2)
- `gumponents/media` - Lazy-loaded media data with resolvers
- `gumponents/relationship` - Posts, taxonomies, items with lazy loading

### REST API Endpoints
- `gumponents/media/v1/get` - Fetch attachment by ID
- `gumponents/relationship/v1/posts/initialize` - Initialize posts for display
- `gumponents/relationship/v1/posts/query` - Search posts with filters
- `gumponents/relationship/v1/taxonomies/initialize` - Initialize terms
- `gumponents/relationship/v1/taxonomies/query` - Search terms

---

## Reference Plugin: wordpress-dynamic-media

The reference plugin for coding standards is at `/Users/junaid/Work/wordpress-dynamic-media`.

### PHP Standards (To adopt)
- **Namespace pattern:** `Aysnc\WordPress\{PluginName}\`
- **PHP 8.3+ minimum** with `declare(strict_types = 1)` everywhere
- **Composer PSR-4 autoloading** (no custom autoloader)
- **PHPStan at max level** for static analysis
- **Custom Aysnc packages:**
  - `aysnc/wordpress-php-cs-fixer` (^0.3.0)
  - `aysnc/wordpress-phpcs` (^0.1.0)
- **Coding standard:** Custom Aysnc WordPress standards
- **Testing:** PHPUnit 9.6 with `WP_UnitTestCase`, `yoast/phpunit-polyfills`
- **CI/CD:** GitHub Actions with lint + test + static analysis
- **WordPress env:** `@wordpress/env` for local development

### Key Patterns from Reference
- Static caching for config/data
- Filter-based configuration (all config via WordPress filters)
- Adapter pattern for extensibility
- Clean entry point: main file → Plugin::bootstrap()
- Comprehensive type hints and PHPDoc array shapes
- `.editorconfig` with tabs, LF line endings

### What the Reference Plugin Does NOT Have (PHP-only plugin)
- No JavaScript/TypeScript (it's a backend-only plugin)
- No webpack/wp-scripts
- No block editor components
- No @wordpress npm packages

---

## Migration Decisions (All Finalized)

### Architecture
- **PHP namespace:** `Aysnc\WordPress\Gumponents`
- **Plugin name:** Stays "Gumponents"
- **TypeScript:** Convert all JavaScript to TypeScript
- **WordPress packages:** Use `@wordpress/*` as proper ES module imports (not `wp` global)
- **Build system:** `@wordpress/scripts` (wp-scripts) — replaces custom webpack + Babel
- **Distribution:** Both `window.gumponents` global (BC) and future npm package
- **React patterns:** Modernize `compose`/`withSelect`/`withDispatch` → `useSelect`/`useDispatch` hooks
- **Data stores:** Modernize `registerStore` → `createReduxStore` + `register`
- **PHP standards:** Strict types, PHPStan max, Aysnc PHPCS/CS-Fixer, Composer PSR-4
- **PHP version:** 8.3+ minimum
- **Plugin entry:** `Plugin::bootstrap()` static class pattern (matches reference plugin)
- **JS/CSS linting:** All handled by `@wordpress/scripts` (ESLint, Stylelint, Prettier)
- **JS formatting:** WordPress Prettier config (`@wordpress/prettier-config`) via `wp-scripts format`
- **ESLint:** Extends wp-scripts default config (includes TypeScript + Prettier enforcement via `recommended-with-formatting`)
- **Stylelint:** `@wordpress/stylelint-config/scss` for SCSS linting
- **Type checking:** `tsc --noEmit` (separate from build — wp-scripts uses Babel, not tsc, for compilation)

### Components
- Keep ALL 15 components with full backwards compatibility
- All props interfaces must remain identical externally
- All component behavior must be preserved

### Dependencies
- **Drop:** react-beautiful-dnd → replace with `@dnd-kit/core` + `@dnd-kit/sortable`
- **Drop:** lodash → replace with native JS (dedup by ID, typeof checks, `in` operator, etc.)
- **Keep:** react-select (revisit later — potential replacement with core ComboboxControl/FormTokenField)
- **Keep:** classnames

### Backwards Compatibility Commitments
All of these MUST remain unchanged:
- REST API routes: `gumponents/media/v1/...`, `gumponents/relationship/v1/...`
- PHP filter/hook names: `gumponents_*` prefix
- Data store names: `gumponents/media`, `gumponents/relationship`
- CSS classes: `gumponents-*` / `gumponent-*` prefixes
- Script handle: `gumponents-blocks` (JS), `gumponents` (CSS)
- Window global: `window.gumponents.components`
- All PHP filter signatures and arguments

### Directory Structure
```
src/                    # PHP source (PSR-4 root for Aysnc\WordPress\Gumponents\)
  Plugin.php            # Static bootstrap class
  RestApi/
    MediaController.php
    Relationship/
      Controller.php
      PostsController.php
      TaxonomiesController.php
resources/              # TypeScript + SCSS source
  index.ts              # Entry point → assigns window.gumponents
  types/                # Shared TypeScript interfaces
  data/                 # WordPress data stores
    media.ts
    relationship.ts
  components/           # All 15 components (mirrors current structure)
build/                  # wp-scripts output (gitignored)
  index.js              # Bundled JS (replaces assets/dist/blocks.js)
  index.css             # Extracted CSS (replaces assets/dist/editor.css)
  index.asset.php       # Auto-generated dependency array
tests/                  # PHPUnit tests
gumponents.php          # Plugin entry point
composer.json           # PHP deps, PSR-4 autoload
package.json            # npm deps, wp-scripts
tsconfig.json           # TypeScript config
webpack.config.js       # Minimal wp-scripts override (custom entry dir)
phpstan.neon            # Static analysis at max level
phpcs.xml               # Aysnc-WordPress ruleset
.php-cs-fixer.dist.php  # PHP formatting
.eslintrc.js            # ESLint (extends wp-scripts default + TypeScript)
.stylelintrc.json       # Stylelint (WordPress SCSS rules)
.prettierrc.js          # Prettier (WordPress config)
.editorconfig           # Editor standards
.wp-env.json            # WordPress local env (PHP 8.3)
.github/workflows/test.yml  # CI/CD
```

### Key Technical Notes
- wp-scripts auto-generates `build/index.asset.php` with dependency arrays — replaces the hardcoded `$deps` in current `enqueue_editor_assets()`
- wp-scripts externalizes all `@wordpress/*` packages at build time (they load from WP core at runtime)
- `react-select` and `@dnd-kit/*` get bundled into the output (not externalized)
- The `registerStore` API is deprecated — use `createReduxStore` + `register` (same store names for BC)
- Lodash replacement strategy: dedup arrays by `id` field instead of `unionWith`/`isEqual`; use `typeof`, `in` operator, optional chaining instead of utility functions
