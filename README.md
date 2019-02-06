# Eleventy + Netlify CMS Static Site Generator

## Stack

This is a custom solution for static, NetlifyCMS-enabled websites developed by and for [idiaz.roncero](http://idiazroncero.com).

It is itself a fork of [eleventy-netlify-boilerplate](https://github.com/danurbanowicz/eleventy-netlify-boilerplate).

It uses gulp for asset handling, especially image handling (resize / minify). This could and should be moved into Eleventy's own build system in the future.

For the front-end, it depends on [huesos](https://www.npmjs.com/package/huesos), a custom SCSS framework. The framework configuration overrides are handled on  `/src/assets/scss/_config.scss`.

## Image assets

This sytem expects the user to upload to `src/assets/img` __only__ the larger image that needs to be available (by default, 1400px wide @ 2x = 2800px wide). 

It will automatically create a normal and @2k version of four sizes: thumbnail, small, medium and large.. It will also make a `.webp` copy of every file.

If it can't enlarge an image, it will silently fail and continue. But beware! This might cause some errors on auto-generated `<picture>` elements since the asset will be referred but not available to the browser.

To auto-generate all the markup needed for responsive images (we assume `100w` as the sizes attribute), use the custom `picture` nunjucks filter:

```
    {{ '/path/to/image/asset.png' | picture | safe }}
```

We use `<picture>` instead of the leaner `<img srcset="" >` syntax in order to be able to use a `<srcset>` for `.webp`, a `.jpg` `<srcset>` fallback for less-capable browsers and finally a `<img>` tag for legacy browsers.

Note that `safe` filter is needed in order to output HTML.

For non-responsive images, an img filter is also provided in order to output both a `.webp` and a `.jpg` version;

```
    {{ '/path/to/image/asset.png' | img | safe }}
```


## Commands

`yarn build` triggers a complete build of all the static and compiled assets.

`yarn watch` starts the watch process for Eleventy.

`yarn serve` starts the watch process + a Browserify server for live-testing.

`yarn debug` triggers a eleventy build with the DEBUG flag for debugging.

`yarn sass` compiles sass into css with sourcemaps and nested output.

`yarn sass:prod` compiles sass into css without sourcemaps and compressed.

`yarn sass:watch` starts a watch process for SASS.
