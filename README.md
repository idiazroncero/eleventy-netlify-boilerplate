# Eleventy + Netlify CMS Static Site Generator

[![Netlify Status](https://api.netlify.com/api/v1/badges/5d0ca7a5-6f8a-47fc-bb0c-b1f04b729bd1/deploy-status)](https://app.netlify.com/sites/eleventy-netlify-cms/deploys)


## Stack

This is a custom solution for static, NetlifyCMS-enabled websites developed by and for [idiaz.roncero](http://idiazroncero.com).

It is itself a fork of [eleventy-netlify-boilerplate](https://github.com/danurbanowicz/eleventy-netlify-boilerplate).

It uses gulp for asset handling, especially image handling (resize / minify). This could and should be moved into Eleventy's own build system in the future.

For the front-end, it depends on [huesos](https://www.npmjs.com/package/huesos), a custom SCSS framework. The framework configuration overrides are handled on  `/src/assets/scss/_config.scss`.

## Image assets

### Using gulp

If your site is not heavy on images, you can use the `image` scripts in order to generate all the needed crops and resizes and `.webp` versions.

This sytem expects the user to upload to `src/assets/img` __only__ the larger image that needs to be available (by default, 1400px wide @ 2x = 2800px wide). 

It will automatically create a normal and @2k version of four sizes: thumbnail, small, medium and large.. It will also make a `.webp` copy of every file.

If it can't enlarge an image, it will silently fail and continue.

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

### Using LFS

Netlify provides support for [large media](https://www.netlify.com/docs/large-media/) using git lfs.



## Commands

`yarn build` triggers a complete build of all the static and compiled assets.

`yarn build:noimg` does the same, but without images. This is useful if you are hosting lots of images, can't allow the lengthy image build process and/or use a third-party solution (like Git LFS, Cloudinary, Uploadcare, etc).

`yarn watch` starts the watch process for both Eleventy and sass.

`yarn serve` starts the watch process + a Browserify server for live-testing.

`yarn debug` triggers a eleventy build with the DEBUG flag for debugging.

`yarn css` compiles sass into css with sourcemaps and nested output.

`yarn css:prod` compiles sass into css __without__ sourcemaps and compressed. It is used on "build" command.

`yarn css:watch` starts a watch process for SASS. It is used on "watch" command.

`yarn css:post` runs postcss plugins, using .browserlistrc for browser usage and postcss.config.js to load plugins (postcssPresetEnv and stylelint by default). It is used on "build" command.

`yarn images` runs gulp processImages tasks. It cleans the images, creates webp and minified versions and generate all the configured resizes and crops. It can become a rather lengthy and memory-heavy process, so use it wisely and switch to another solutons (LFS, third-party) if your image assets grow.

`yarn images:clean` runs gulp cleanImages task, deleting all images except the originals.

`yarn images:resize` performs gulp resizeImages task, creating all the configured resizes and crops from the original images.

`yarn images:minify` runs gulp minifyImages. Creates webp versions and minifies jpg and pnf files.


## TODO

- Add metadata on _head.njk and a way to config it on metadata.json
- Betterment of LFS handling
- Link preload/etc
- Multiple favicon / color on android customization

