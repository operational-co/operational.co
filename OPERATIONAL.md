# OPERATIONAL.md

## Snapshot
- Repository: `operational.co` monorepo
- Snapshot date: 2026-03-06 (local workspace review + live site review)
- Product site checked: `https://operational.co`

## What this project is
Operational is an open-source event tracking and operational monitoring product for software teams. The product is positioned as:
- an "open-source alternative to Logsnag"
- a timeline for critical backend/product events (signups, cronjobs, webhooks, billing events, suspicious activity)
- a tool with push notifications (web/mobile PWA), action buttons (webhook triggers), contexts (events-in-events), categories/search, dashboards/widgets
- available as hosted SaaS (`operational.co` + `app.operational.co`) and self-hosted

From the repo + site content, the intended user is a technical founder/dev team that wants fast event visibility, manual operational controls, and self-hosting flexibility.

## Monorepo structure
Top-level folders and roles:
- `app/`: Vue 3 SPA web app (main product UI for events, settings, dashboards)
- `backend/`: Express 5 API + business logic + Prisma + services (ingestion, auth, billing, push, cron, storage)
- `website/`: Astro marketing/docs/content site with Vue islands
- `packages/`: shared packages and plugin artifacts
  - `packages/components/`: shared Vue UI/form/card/playground components
  - `packages/styles/`: shared SCSS design tokens + reset + typography + forms
  - `packages/lib/`: shared JS utilities and pricing logic
  - `packages/sdk/`: JS SDK published as `@operational.co/sdk`
  - `packages/operational/`: WordPress plugin (PHP)
- `docker/`: Dockerfile, compose file, nginx config, startup script
- `bin/`: setup scripts for Linux VPS, general local setup, Windows setup
- `.github/workflows/docker-build.yml`: GHCR image build/publish on version tags

## Workspace/package model
Root `package.json` uses npm workspaces:
- `packages/*`, `backend`, `app`, `website`, `sdk`

Note:
- `sdk` workspace path is listed but there is no top-level `sdk/` directory (the SDK actually lives in `packages/sdk/`).

## App (`/app`) architecture
Tech:
- Vue 3
- Pinia
- Vue Router
- Vite
- `vue-final-modal`
- PWA via `vite-plugin-pwa`

Structure:
- `src/components/`: feature-first component folders (`events`, `dashboards`, `settings`, `onboarding`, etc.)
- `src/store/`: Pinia stores (`app`, `user`, `workspace`, `events`, `dashboards`, etc.)
- `src/lib/`: HTTP client, reusable store base, utilities
- `src/router/index.js`: top-level routes

Patterns:
- Mostly Vue Options API (`data`, `computed`, `watch`, `methods`, lifecycle hooks)
- Global `$store` injection via `app/src/lib/plugin-pinia.js` (store instances attached to `app.config.globalProperties.$store`)
- Shared UI from `@operational.co/components` and shared styles from `@operational.co/styles/main`
- Event screen uses polling + infinite scroll + search/category filtering + modal detail/action flows

## Backend (`/backend`) architecture
Tech:
- Node.js (>=18.18 <=22)
- Express 5
- Prisma (MySQL)
- Optional ClickHouse event store
- Croner for background jobs
- Stripe, web-push, email providers, S3-compatible storage support

Entry point:
- `backend/index.js`
  - boots services first (`Clickhouse`, `Db`, `Webpush`, `Pdf`, `Storage`, `Key`, `Ingestion`, `Email`, `Cron`, `Session`, `Billing`, `Demo`, `Internal`)
  - mounts route modules
  - exposes hosted-mode LLM docs endpoints (`/llms.txt`, `/llm.txt`)

Mounted route groups:
- `/api/v1` -> ingestion + identify + widget push + OpenAPI/LLMs docs
- `/events`
- `/user`
- `/workspace`
- `/website`
- `/metric`
- `/invoice`
- `/dashboards`

Backend layering style:
- `components/<domain>/routes.js` -> HTTP endpoints
- `components/<domain>/index.js` -> domain/service-level orchestration
- `components/<domain>/model.js` -> persistence-oriented model behavior
- `services/*` -> cross-domain infrastructure/service modules
- `lib/*` -> shared backend helpers/base classes/config

### Event ingestion pipeline
Core path is `POST /api/v1/log`:
- auth via bearer API key
- payload normalization + validation in `services/ingestion/index.js`
- support for event types (`text`, `rows`, `json`, `image`, `map`)
- actions get normalized and state metadata attached (`PENDING`, `repeat`, `expireIn`, etc.)
- searchable text generated for search
- event persisted through DB abstraction
- optional push notification dispatch when `notify` is true
- category recompute queue updated when category is present

### Event storage abstraction
`services/db/index.js` switches based on `EVENT_STORE`:
- `mysql` (default in config)
- `clickhouse` (optional)

Both backends expose similar methods (`find`, `findLatest`, `findOne`, `insertOne`, stats helpers, etc.).

### Background jobs
`services/cron/index.js` schedules:
- test event cleanup
- old event cleanup (self-hosted)
- event-name cache generation
- category recomputation
- billing runs (hosted)
- usage metric calculations
- invite cleanup

### Data model (Prisma)
Main models:
- `User`, `Workspace`, `WorkspaceUser`
- `Events`
- `Apikey`
- `Invoice`, `Coupon`, `Metric`
- `Dashboard`, `Widget`, `WidgetPoint`
- `Push`, `Session`, `Invite`, `Category`, `CategoryRecomputeQueue`

Enums include:
- `WorkspaceStatus`, `UserStatus`, `Role`
- `EventType` (`text`, `rows`, `json`)
- `WidgetType`, `SourceType`, invoice/coupon status enums

## Website (`/website`) architecture
Tech:
- Astro 5
- `@astrojs/mdx`, `@astrojs/vue`, `@astrojs/sitemap`
- Vue components as islands
- Shared design system imported from `@operational.co/styles/main.scss`

Content model:
- Astro collections in `website/src/content.config.js`
- Major content collections: `docs`, `docsnew`, `api`, `manual`, `selfhosted`, `integrations`, `pages`, `usecases`
- `docsnew` is loaded from `../backend/src/content/docs-new` (cross-package shared content source)

Site routing:
- marketing pages (`index`, `pricing`, `about`, `open-source`, etc.)
- content sections via catch-all pages:
  - `/docs/[...slug]`
  - `/api/[...slug]`
  - `/manual/[...slug]`
  - `/selfhosted/[...slug]`
  - `/integrations/[...slug]`
  - `/usecases/[...slug]`
  - `/docs-new/[...slug]`
- dynamic text export at `/llms.txt`

Extra integration:
- `website/src/lib/helper.js` fetches Directus `article` content and caches to `.directus-cache.json` (1h TTL)

## Shared packages

### `packages/components`
- Vue component library used by app and website
- Areas include UI primitives, forms, cards, code rendering, pricing widgets, playground code generators

### `packages/styles`
Shared SCSS framework:
- token mixin in `_vars.scss`
- reset, typography, form controls, table/code styling, fonts, nprogress styles
- imported as `@operational.co/styles/main`

### `packages/lib`
- small utility helpers (`slugify`, date formatting/diff)
- pricing calculation (`generate-cost.js` + `prices.js`)

### `packages/sdk`
- JS SDK class `Operational`
- wraps axios and exposes:
  - `events.ingest(event)`
  - `users.identify(user)` (marked as deprecated in code comments)
- build via Vite lib mode to ES + UMD in `build/`

### `packages/operational` (WordPress plugin)
- Plugin metadata + admin/public classes
- Settings page for API key/base URL
- Hooks WordPress events (login, logout, user register/profile updates, plugin/theme changes, failed login, etc.)
- Sends events to Operational via plugin helper functions

## Coding style and conventions observed
General JS style:
- ESM modules (`type: module` in major packages)
- plain JavaScript (very little TypeScript, mainly Astro defaults)
- semicolons and double quotes consistent with Prettier config
- mix of spaces/tabs in some areas (not fully uniform)

Vue style:
- Options API dominates (not Composition API-heavy)
- component-scoped SCSS in `<style lang="scss">`
- class naming commonly follows `c-` component prefix and `p-` page prefix
- frequent BEM-like sub-elements (`__inner`, `__body`, etc.)

Backend style:
- pragmatic module/object/class pattern
- route file per domain
- repeated defensive `try/catch` with string/object error messages
- some legacy/deprecated/commented paths kept in place

Naming style in repo (actual):
- file names are mostly kebab-case or simple lower-case
- class names are PascalCase
- function/method names are generally camelCase
- CSS classes are predominantly prefixed (`c-`, `p-`, `d-` for sections on website landing page)

## CSS styling system
Design language is centralized in `packages/styles`:
- dark-first palette via HSL custom properties
- spacing, radius, typography, transitions, shadows defined as CSS variables
- shared button/input system (`.btn`, `.form-control`, switches, etc.)
- shared typography defaults for headings/body/code
- global reset and scrollbar styling

Component-level styling approach:
- SCSS nesting is used heavily
- layout combines CSS Grid + flexbox patterns
- transitions/animations are simple and intentional (fade/slide, highlight flashes, jiggling promo visuals)
- responsive behavior handled with media queries in each component

## Component HTML/CSS authoring patterns (`/packages` + `/website`)
Review scope used for this section:
- `packages/components/**` and `website/src/components/**`
- 115 Vue SFC component files + 1 Astro component file
- 107 files use `<style lang="scss">`
- 1 file uses scoped styles (`packages/components/form/input-upload.vue`)

Template/HTML conventions:
- Vue SFCs are the default component format in both folders.
- Most templates use a single root wrapper with block classes and nested element classes.
- Class naming is prefix-driven and BEM-like (`c-` for reusable components, `p-` for page wrappers, `d-` for landing/demo sections).
- Component composition is slot-heavy in shared UI primitives (`<slot>`, named slots like `title`, `body`, `sidebar`, `pre-input`, `post-input`).
- A few content components render trusted HTML/markdown using `v-html` (primarily docs/article rendering).

CSS/SCSS conventions:
- Styles are mostly global (non-scoped), relying on unique class prefixes to avoid clashes.
- SCSS nesting is used consistently around block classes (`.c-x { &__y { ... } }`).
- Shared design tokens are used for colors, typography, radius, and transition timing (`var(--color-*)`, `var(--font-size-*)`, `var(--border-radius*)`).
- Spacing values in these component folders now lean on direct `rem` values for margin/padding/gap rather than spacing vars.
- Layout primitives are mostly flex/grid (`display: flex` and `display: grid` are common across component files).
- Responsive behavior is component-local with media queries, with breakpoints commonly around `576px`, `980px`, and larger layout breakpoints in landing/marketing components.

Folder-specific style behavior:
- `packages/components` acts as the shared UI system used by app + website, with reusable wrappers and form/card primitives.
- `packages/components` styling is practical and component-contained, with minimal scoped CSS and no CSS modules.
- `website/src/components` is mostly marketing/docs presentation components (hero blocks, landing sections, article pages, headers/footers, content widgets).
- `website/src/components` uses stronger visual section styling and more page-level wrappers while following the same SCSS/naming conventions.
- `website/src/components` mixes shared package components (for consistency) with website-specific presentation components.

Practical rules to keep consistency:
- Keep new component wrappers prefix-based (`c-`, page wrappers `p-`) and maintain BEM-like element naming.
- Prefer local SCSS blocks in the component file; use `scoped` only when isolation is explicitly needed.
- Keep spacing in `rem` for margins/paddings/gaps.
- Keep responsive rules in the same component file near the related block styles.
- Continue reusing shared components/tokens before adding one-off styles.

## LLM implementation rules (Codex/agents)
Use these as hard constraints when making HTML/CSS/component changes in this repo.

1. Follow existing structure before inventing new structure.
- Match the surrounding file's style, naming, and component composition.
- Extend existing components/wrappers first (`PageApi`, `Constrain`, `Toc`, shared `@operational.co/components`).

2. Keep class naming consistent with the repo.
- Use prefixed classes: `c-` (component), `p-` (page), `d-` (section/demo).
- Use BEM-like element naming (`block__element`, optional state classes like `.active`, `.expanded`).

3. Keep styling in local SCSS blocks.
- Default to `<style lang="scss">` in the component file.
- Do not introduce CSS modules, Tailwind-style utility rewrites, or new styling frameworks.
- Use `scoped` only when isolation is truly required.

4. Preserve the design token system.
- Use existing CSS variables for colors, typography, radius, shadows, and transitions.
- Do not hardcode new color systems unless the feature explicitly requires it.
- Reuse existing typography styles/classes/tokens as the default choice; only modify type styles when the feature clearly requires it.

5. Keep spacing and sizing conventions aligned.
- For margin/padding/gap/size values, prefer `rem`-based sizing.
- Avoid introducing legacy spacing vars for layout spacing where rem values are now used.

6. Keep responsive behavior component-local.
- Add responsive rules in the same component SCSS block.
- Prefer existing breakpoint patterns already used in repo (`576px`, `980px`, plus section-specific larger breakpoints).

7. Keep DOM and templates pragmatic.
- Keep one clear root wrapper for component templates.
- Avoid unnecessary nesting and wrapper div inflation.
- Prefer semantic elements when they fit existing patterns.

8. Reuse existing interactive patterns.
- Use existing button patterns/classes and motion timing conventions.
- For menus/dropdowns/modals, align with current behavior patterns (state class toggles, outside click handling, escape-to-close where relevant).

9. Do not silently break content/documentation flows.
- For docs pages, preserve shared layout behavior (TOC/sidebar/content wrappers/prev-next flow).
- New docs UI should integrate through shared wrappers, not one-off page hacks.

10. Before finalizing, verify consistency.
- Check neighboring components/pages for style parity.
- Validate build/lint where possible and call out any environment-limited failures explicitly.

## Operational.co site positioning and messaging (live + source)
Current messaging emphasizes:
- "Monitor your product's critical events as they happen"
- Open-source + self-hosted support
- differentiation from analytics suites (PostHog/Mixpanel) and notifier tools (Logsnag/ntfy-style tools)
- core value props: timeline visibility, push alerts, action buttons, contexts, copy-paste integrations

Primary user journeys on site:
- sign up / open app
- read docs/manual/api
- use playground for integration snippets
- self-host via local/VPS/Render/Docker guides
- browse use-case-driven docs (SaaS, WordPress, PHP, Node, etc.)

## Build, release, and deployment
Release/build paths in repo:
- root scripts for starting backend/website and Docker build
- app/website/backend have local `dev`/`build` scripts
- GitHub workflow builds and pushes multi-arch Docker images to GHCR on version tags (`v*`)
- Docker setup bundles frontend build + backend runtime + nginx reverse/static serving
- helper scripts in `bin/` support local and VPS setup flows

## Configuration and environment model
Important backend env domains in `backend/lib/config.js`:
- core runtime: `PORT`, `SECRET`, `DATABASE_URL`, `EVENT_STORE`
- URLs/CORS: `API_URL`, `APP_URL`, `CORS`, `SELFHOSTED`
- retention: `REMOVE_EVENTS_AFTER`, `REMOVE_TEST_EVENTS_AFTER`
- push/email/billing/storage integration keys

Notable behavior:
- self-hosted mode defaults to `true` unless explicitly `SELFHOSTED="false"`
- hosted-only routes/features are conditionally enabled in code

## Documentation/content footprint
- large MDX content base under `website/src/content`
- extended docs-new content now also exists in `backend/src/content/docs-new`
- use-case library is extensive and SEO-oriented
- `/llms.txt` exists in both backend and website contexts to improve LLM-facing discoverability

## Quality, consistency, and maintenance observations
- No meaningful automated test suite found in app/backend/website package code.
- Validation middleware appears inconsistent:
  - `backend/components/middleware/schema.js` treats any truthy validator output as valid (Fastest Validator returns arrays for errors, which are truthy).
  - `backend/lib/schema-middleware.js` compiles schema but effectively always calls `next()`.
- Some duplicate methods exist (example patterns in `events/model.js` and `services/db/index.js`).
- There is a mix of newer and legacy patterns (commented code, deprecated notes, duplicate logic).
- Repo currently has many pre-existing modified/untracked files in the working tree unrelated to this document creation.

## Practical mental model
If you need to reason about this codebase quickly:
1. Think of `backend` as the source of truth and operational engine.
2. Think of `app` as the operator console for events, team/project settings, and dashboards.
3. Think of `website` as marketing + docs + onboarding funnel.
4. Think of `packages/components` and `packages/styles` as the shared UI/design system glue.
5. Think of `packages/sdk` + `packages/operational` as the integration surface for external apps.

## Quick path map
- Main app UI entry: `app/src/main.js`
- Main backend entry: `backend/index.js`
- Main website layout: `website/src/layouts/base.astro`
- Shared style entry: `packages/styles/main.scss`
- JS SDK source: `packages/sdk/src/index.js`
- WP plugin entry: `packages/operational/operational.php`
