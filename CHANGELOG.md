# [1.1.0](https://github.com/cdx-foundation/cdx-solidjs-components/compare/v1.0.1...v1.1.0) (2026-06-18)

### Features

- **useTheme:** accept config arg to set theme directly ([63ec6e1](https://github.com/cdx-foundation/cdx-solidjs-components/commit/63ec6e18a87c96f2f982665d3d8250d1a83f5b60))

## [1.0.1](https://github.com/cdx-foundation/cdx-solidjs-components/compare/v1.0.0...v1.0.1) (2026-06-18)

### Bug Fixes

- configure semantic-release for npm OIDC trusted publishing ([56cc113](https://github.com/cdx-foundation/cdx-solidjs-components/commit/56cc1138925b2967878b6ba053cc3e6da669ea37))
- disable solid-refresh HMR during vitest to prevent file URL error on Windows ([12187c5](https://github.com/cdx-foundation/cdx-solidjs-components/commit/12187c5b6c35331441d890aa40fe57d73125cc26))
- resolve scoped package publish failure and refactor release config ([279ee58](https://github.com/cdx-foundation/cdx-solidjs-components/commit/279ee58d9dae5b1f25cbbe9a69cb442feea1f207))

# 1.0.0 (2026-06-17)

- feat!: architectural refactor to composable components and new docs system ([8b62c87](https://github.com/cdx-foundation/cdx-solidjs-components/commit/8b62c8708b1bb09ff4b8a8639a0323ebd7d2a1c9))
- feat!: major v2.0.0 release - composable architecture and performance overhaul ([4cd3814](https://github.com/cdx-foundation/cdx-solidjs-components/commit/4cd381412c2944560b7a4494b5197f59542fc8be))

### Bug Fixes

- add @semantic-release/exec to format package.json after npm version bump ([a1c395f](https://github.com/cdx-foundation/cdx-solidjs-components/commit/a1c395fdb8e5775b638f2c03615d9b70ccb92199))
- add concurrency control to release workflow ([d971e3c](https://github.com/cdx-foundation/cdx-solidjs-components/commit/d971e3c48fcf95ad7d409c66fa1342f94d1b438b))
- add missing Show import to HoverCard and Tooltip ([4ec4d4c](https://github.com/cdx-foundation/cdx-solidjs-components/commit/4ec4d4c05846f5ee737e567796af6c386b2acb9a))
- add repository field for GitHub Packages ([3285edb](https://github.com/cdx-foundation/cdx-solidjs-components/commit/3285edb9ff0fb55b92ffe25f4a23b4b6756cbc8b))
- allow release prepare command to proceed if version unchanged ([f6b396c](https://github.com/cdx-foundation/cdx-solidjs-components/commit/f6b396ccce188b6983ef4d1c215840a4194cc982))
- ci cd to run on master not main ([eabdd7f](https://github.com/cdx-foundation/cdx-solidjs-components/commit/eabdd7f76839a7a0d5b8bf030199607d1891a656))
- ensure tests run from project root instead of demo root ([64fa23e](https://github.com/cdx-foundation/cdx-solidjs-components/commit/64fa23eff15510fdad494aa457d208e997283b67))
- resolve bun catalog resolution errors by using explicit versions ([24e33f4](https://github.com/cdx-foundation/cdx-solidjs-components/commit/24e33f41f88d2adbbec3d73572851f1133643eb3))
- resolve CSS import order and remove redundant font imports ([7eba884](https://github.com/cdx-foundation/cdx-solidjs-components/commit/7eba88499be53dc32128d37c68b777e33dad67b9))
- resolve excessive stack depth in vite.config.ts by removing lazyPlugins ([b034213](https://github.com/cdx-foundation/cdx-solidjs-components/commit/b034213073fe9a27060a6502433c5d6ed2eab0ff))
- resolve TS interface conflicts for custom onChange props ([9677130](https://github.com/cdx-foundation/cdx-solidjs-components/commit/9677130cd9777bd54832cae0c97a88b1d210c244))
- resolve typecheck error by enabling skipLibCheck ([c5c6705](https://github.com/cdx-foundation/cdx-solidjs-components/commit/c5c6705edf44da7cb1fc6ce8d7e7d12e66c403ea))
- robust typography application and variable renaming ([e47bfb2](https://github.com/cdx-foundation/cdx-solidjs-components/commit/e47bfb29161a3a19ca057d6c714b27b232a28b94))
- tests updated + passing + typpo in crate name fixed + theme import simplified in css ([8db6bc0](https://github.com/cdx-foundation/cdx-solidjs-components/commit/8db6bc0a5365ac1f256293750ba3240361cafd21))
- tests updated + passing + typpo in crate name fixed + theme import simplified in css ([8f197ac](https://github.com/cdx-foundation/cdx-solidjs-components/commit/8f197ac61e6ee0519d9677d947370fbc7f4892b1))
- **Toast:** implement global stack for Toaster to prevent duplicates and fix positioning issues ([b3592dd](https://github.com/cdx-foundation/cdx-solidjs-components/commit/b3592dd9e2d6db80a9ec1b378284522d6284dbbe))
- **types:** resolve build errors in Button, Resizable, and SegmentedControl ([8b30cc9](https://github.com/cdx-foundation/cdx-solidjs-components/commit/8b30cc92d49914ab431af9a05392e297ef7e3747))

### Features

- add alignment props to DatePicker and Calendar and fix accessibility issues ([c63999b](https://github.com/cdx-foundation/cdx-solidjs-components/commit/c63999b9f882cb99f41e97ed1e766dfea3d0d662))
- add diagonal positioning support for Popover and HoverCard ([cf58bea](https://github.com/cdx-foundation/cdx-solidjs-components/commit/cf58beae9f8ba79c5c15deab3eb6186f667463c4))
- add polymorphic 'as' prop to Badge, Card, Alert, and Avatar ([db003cb](https://github.com/cdx-foundation/cdx-solidjs-components/commit/db003cb1d88174bafc3b22325b0f8c472bae6b02))
- add shadcn-style Sidebar component, bump to v1.0.0 ([c965801](https://github.com/cdx-foundation/cdx-solidjs-components/commit/c96580147e3105a666f6a23fbc41f8a2ba463d48))
- add toast configuration, input description, and improve accessibility ([dc639c7](https://github.com/cdx-foundation/cdx-solidjs-components/commit/dc639c79a44f92d293eddf0b5a8aa127cd7f6b77))
- finalize v3.0.0 with standardized component patterns and enhanced ThemeCreator ([f7a5aac](https://github.com/cdx-foundation/cdx-solidjs-components/commit/f7a5aac4b57bcce3b545c96267a41dad03b851e5))
- **hooks:** redesign useTheme API with defaults, accessors, and mode-scoped setters ([5026d56](https://github.com/cdx-foundation/cdx-solidjs-components/commit/5026d56eab7d8d556081768861a8f10751f114c2))
- restore useTheme persistence and DOM sync (v3.0.2) ([4e3f2b9](https://github.com/cdx-foundation/cdx-solidjs-components/commit/4e3f2b99b06085ab1daf3ec14dfe64cd1e7dfff8))
- Theme usage updated + ci/cd for demo to be hosted ([ab9a1a0](https://github.com/cdx-foundation/cdx-solidjs-components/commit/ab9a1a0e02416439bc30c6126f093756102cad28))
- **toast:** improve toast API and remove horrible movement animations across components ([9a117ae](https://github.com/cdx-foundation/cdx-solidjs-components/commit/9a117ae2771ce483d8a738b3fb371b5cba2cec9c))
- useTheme improvements, ColorPicker live updates, sidebar tab persistence ([d83e008](https://github.com/cdx-foundation/cdx-solidjs-components/commit/d83e008a530327e7387980caae4ed4f2167ac54a))
- v3.0.0 - Enhanced Theme Architecture, Brutalist UI & Expanded Typography ([367cf2d](https://github.com/cdx-foundation/cdx-solidjs-components/commit/367cf2daa4287c0d2aecc01458ed166e06b25b3c))

### BREAKING CHANGES

- Core components (Modal, Sheet, Toast, Command, Accordion, Card, etc.) have been refactored from prop-based to composable sub-component patterns.

* feat: add comprehensive documentation system with examples for all 40+ components

* feat: implement a robust, fixed-position Floating utility for all overlays

* feat: add functional Resizable engine and optimized Carousel components

* perf: optimize Command and Select navigation using createSelector

* fix: resolve Avatar fallback rendering issues with context-driven state

* fix: eliminate overlay "top-left" spawn bugs and "floaty" animations

* test: recover and update full test suite (72 tests passing)

* chore: achieve 100% biome lint compliance and format parity

- Modal, Sheet, Toast, and Command components have been refactored to use composable children instead of string props for titles and descriptions.

* feat: add comprehensive documentation system in /docs

* feat: add new Code and SegmentedControl components

* feat: restructure demo app with theme switching and live previews

* feat: Modal/Sheet now use sub-components (Header, Title, Footer, etc.)

* refactor(Command): move from index-based to ID-based item navigation

* fix(Tooltip): correct 'bottom' alignment CSS centering

* test: add Tooltip unit tests

# 1.0.0 (2026-06-15)

- feat!: architectural refactor to composable components and new docs system ([8b62c87](https://github.com/cdx-foundation/cdx-solidjs-components/commit/8b62c8708b1bb09ff4b8a8639a0323ebd7d2a1c9))
- feat!: major v2.0.0 release - composable architecture and performance overhaul ([4cd3814](https://github.com/cdx-foundation/cdx-solidjs-components/commit/4cd381412c2944560b7a4494b5197f59542fc8be))

### Bug Fixes

- add @semantic-release/exec to format package.json after npm version bump ([a1c395f](https://github.com/cdx-foundation/cdx-solidjs-components/commit/a1c395fdb8e5775b638f2c03615d9b70ccb92199))
- add concurrency control to release workflow ([d971e3c](https://github.com/cdx-foundation/cdx-solidjs-components/commit/d971e3c48fcf95ad7d409c66fa1342f94d1b438b))
- add missing Show import to HoverCard and Tooltip ([4ec4d4c](https://github.com/cdx-foundation/cdx-solidjs-components/commit/4ec4d4c05846f5ee737e567796af6c386b2acb9a))
- add repository field for GitHub Packages ([3285edb](https://github.com/cdx-foundation/cdx-solidjs-components/commit/3285edb9ff0fb55b92ffe25f4a23b4b6756cbc8b))
- ci cd to run on master not main ([eabdd7f](https://github.com/cdx-foundation/cdx-solidjs-components/commit/eabdd7f76839a7a0d5b8bf030199607d1891a656))
- resolve CSS import order and remove redundant font imports ([7eba884](https://github.com/cdx-foundation/cdx-solidjs-components/commit/7eba88499be53dc32128d37c68b777e33dad67b9))
- resolve TS interface conflicts for custom onChange props ([9677130](https://github.com/cdx-foundation/cdx-solidjs-components/commit/9677130cd9777bd54832cae0c97a88b1d210c244))
- robust typography application and variable renaming ([e47bfb2](https://github.com/cdx-foundation/cdx-solidjs-components/commit/e47bfb29161a3a19ca057d6c714b27b232a28b94))
- tests updated + passing + typpo in crate name fixed + theme import simplified in css ([8db6bc0](https://github.com/cdx-foundation/cdx-solidjs-components/commit/8db6bc0a5365ac1f256293750ba3240361cafd21))
- tests updated + passing + typpo in crate name fixed + theme import simplified in css ([8f197ac](https://github.com/cdx-foundation/cdx-solidjs-components/commit/8f197ac61e6ee0519d9677d947370fbc7f4892b1))
- **Toast:** implement global stack for Toaster to prevent duplicates and fix positioning issues ([b3592dd](https://github.com/cdx-foundation/cdx-solidjs-components/commit/b3592dd9e2d6db80a9ec1b378284522d6284dbbe))
- **types:** resolve build errors in Button, Resizable, and SegmentedControl ([8b30cc9](https://github.com/cdx-foundation/cdx-solidjs-components/commit/8b30cc92d49914ab431af9a05392e297ef7e3747))

### Features

- add alignment props to DatePicker and Calendar and fix accessibility issues ([c63999b](https://github.com/cdx-foundation/cdx-solidjs-components/commit/c63999b9f882cb99f41e97ed1e766dfea3d0d662))
- add diagonal positioning support for Popover and HoverCard ([cf58bea](https://github.com/cdx-foundation/cdx-solidjs-components/commit/cf58beae9f8ba79c5c15deab3eb6186f667463c4))
- add polymorphic 'as' prop to Badge, Card, Alert, and Avatar ([db003cb](https://github.com/cdx-foundation/cdx-solidjs-components/commit/db003cb1d88174bafc3b22325b0f8c472bae6b02))
- add shadcn-style Sidebar component, bump to v1.0.0 ([c965801](https://github.com/cdx-foundation/cdx-solidjs-components/commit/c96580147e3105a666f6a23fbc41f8a2ba463d48))
- add toast configuration, input description, and improve accessibility ([dc639c7](https://github.com/cdx-foundation/cdx-solidjs-components/commit/dc639c79a44f92d293eddf0b5a8aa127cd7f6b77))
- finalize v3.0.0 with standardized component patterns and enhanced ThemeCreator ([f7a5aac](https://github.com/cdx-foundation/cdx-solidjs-components/commit/f7a5aac4b57bcce3b545c96267a41dad03b851e5))
- **hooks:** redesign useTheme API with defaults, accessors, and mode-scoped setters ([5026d56](https://github.com/cdx-foundation/cdx-solidjs-components/commit/5026d56eab7d8d556081768861a8f10751f114c2))
- restore useTheme persistence and DOM sync (v3.0.2) ([4e3f2b9](https://github.com/cdx-foundation/cdx-solidjs-components/commit/4e3f2b99b06085ab1daf3ec14dfe64cd1e7dfff8))
- Theme usage updated + ci/cd for demo to be hosted ([ab9a1a0](https://github.com/cdx-foundation/cdx-solidjs-components/commit/ab9a1a0e02416439bc30c6126f093756102cad28))
- **toast:** improve toast API and remove horrible movement animations across components ([9a117ae](https://github.com/cdx-foundation/cdx-solidjs-components/commit/9a117ae2771ce483d8a738b3fb371b5cba2cec9c))
- v3.0.0 - Enhanced Theme Architecture, Brutalist UI & Expanded Typography ([367cf2d](https://github.com/cdx-foundation/cdx-solidjs-components/commit/367cf2daa4287c0d2aecc01458ed166e06b25b3c))

### BREAKING CHANGES

- Core components (Modal, Sheet, Toast, Command, Accordion, Card, etc.) have been refactored from prop-based to composable sub-component patterns.

* feat: add comprehensive documentation system with examples for all 40+ components

* feat: implement a robust, fixed-position Floating utility for all overlays

* feat: add functional Resizable engine and optimized Carousel components

* perf: optimize Command and Select navigation using createSelector

* fix: resolve Avatar fallback rendering issues with context-driven state

* fix: eliminate overlay "top-left" spawn bugs and "floaty" animations

* test: recover and update full test suite (72 tests passing)

* chore: achieve 100% biome lint compliance and format parity

- Modal, Sheet, Toast, and Command components have been refactored to use composable children instead of string props for titles and descriptions.

* feat: add comprehensive documentation system in /docs

* feat: add new Code and SegmentedControl components

* feat: restructure demo app with theme switching and live previews

* feat: Modal/Sheet now use sub-components (Header, Title, Footer, etc.)

* refactor(Command): move from index-based to ID-based item navigation

* fix(Tooltip): correct 'bottom' alignment CSS centering

* test: add Tooltip unit tests
