# Eleventy + Netlify CMS Static Site Generator

## Stack

This is a custom solution for static, NetlifyCMS-enabled websites developed by and for [idiaz.roncero](http://idiazroncero.com).

It is itself a fork of [eleventy-netlify-boilerplate](https://github.com/danurbanowicz/eleventy-netlify-boilerplate).

For the front-end, it depends on [huesos](https://www.npmjs.com/package/huesos), a custom SCSS framework. The framework configuration overrides are handled on  `/src/assets/scss/_config.scss`.



## Commands

`yarn build` triggers a complete build of all the static and compiled assets.

`yarn watch` starts the watch process for Eleventy.

`yarn serve` starts the watch process + a Browserify server for live-testing.

`yarn debug` triggers a eleventy build with the DEBUG flag for debugging.

`yarn sass` compiles sass into css with sourcemaps and nested output.

`yarn sass:prod` compiles sass into css without sourcemaps and compressed.

`yarn sass:watch` starts a watch process for SASS.
