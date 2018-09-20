# Eleventy + Netlify CMS Static Site Generator

`yarn update` fetches the latest version of Huesos' SCSS framework and performs a `yarn install` on all the dependencies.

`yarn build` is the most important command: it triggers a complete build of all the static and compiled assets, including:

- CSS Style Guide (`src/huesos/docs`)
- SASS compiled to CSS assets (`src/huesos/dist`)
- Eleventy compiled HTML and assets (`dist`)

`yarn watch` starts the watch process for Eleventy.

`yarn serve` starts the watch process + a Browserify server for live-testing

`yarn debug` triggers a eleventy build with the DEBUG flag for debugging

`yarn css:build` triggers the Huesos' framework build process for compiling SASS into CSS

`yarn css:watch` starts a watch process for Huesos' SASS
