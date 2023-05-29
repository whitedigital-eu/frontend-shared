# frontend-shared

Shared components, helpers, composables and types for vue frontend SPAs that use a Midone theme
(e.g. <a href="http://enigma-vue.left4code.com/" target="_blank">enigma</a>)
and <a href="https://api-platform.com/" target="_blank">API platform</a> powered API

# Usage

This package can only be used in an ES module environment.
Moreover, since the package exports .vue files, the consuming app should be able to process .vue files.

## Installation

Npm: `npm i wd-frontend-shared`

Yarn: `npm add wd-frontend-shared`

Pnpm: `pnpm add wd-frontend-shared`

## Setup tailwind config

Your tailwind config should look something like this:
```javascript
// tailwind.config.js
module.exports = {
    content: [
        // other routes
        './node_modules/@left4code/tw-starter/**/*.js',
        './node_modules/wd-frontend-shared/**/*.vue',
    ]
    // other properties
}
```

Now you can `import` and use the components and functions from this library.
Refer to library folder structure.

# Components

For component usage examples see example all in `/src/example`

## Input components

A complete list of components for any kind of data input.
Most input components have 3 props in common:
1. `modelValue`: the value provided to component via `v-model`
2. `label: string`: the label of the input
3. `readonly: boolean`: should the input be readonly

Some components which depend on other external libraries need to have a unique ID.

All components emit event `update:modelValue` which updates the value of the property provided via `v-model`.
Some components emit other events as well, see each component definition.

## HTML content editor (for CMS)
In order for elfinder to work, jquery, jqueryUI and elfinder must be loaded globally (see index.html)