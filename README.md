# Eleventy + Netlify CMS Static Site Generator

[![Netlify Status](https://api.netlify.com/api/v1/badges/5d0ca7a5-6f8a-47fc-bb0c-b1f04b729bd1/deploy-status)](https://app.netlify.com/sites/eleventy-netlify-cms/deploys)


## Stack

This is a custom solution for static, NetlifyCMS-enabled websites developed by and for [idiaz.roncero](http://idiazroncero.com).

It is itself a fork of [eleventy-netlify-boilerplate](https://github.com/danurbanowicz/eleventy-netlify-boilerplate).

It uses gulp for asset handling, especially image handling (resize / minify). This could and should be moved into Eleventy's own build system in the future (see issue [117](https://github.com/11ty/eleventy/issues/117)).

For the front-end, it depends on [huesos](https://www.npmjs.com/package/huesos), a custom SCSS framework. The framework configuration overrides are handled on  `/src/assets/scss/_config.scss`.

For JavaScript, it uses Parcel CLI without any further configuration. We intent to be able to write ES6 and `import` modules without having to configure a full-featured and unneded Webpack/SPA configuration, since we don't need most of Webpack's bells and whistles. Of course, you are free to ignore this and set your own JS toolbox.

## Image assets

Image handling is one of the biggest issues on static site generators. Without server-side tools like Imagick, the usual transform/crop/resize operations become a problem.

This project stores all image assets that will need operations on `src/images`, output the files to `src/public/images/` and exposes a `images.config.js` config file to decide which strategy to follow (git `lfs` can be either true or false) and how many crops are needed.

This is a sample `images.config.js`:

```
{
    sourceDir : './src/public/images', // The original source of the assets
    relativeSourceDir : '/public/images', // The real, final path
    lfs : true, // Wether to use lfs or not 
    nf_resize: 'fit', // If LFS is true, which resize algorithm to use
    sizes : [ // An array of sizes
        {
            name: 'large', // Name of the size, will also be the destination sub-folder
            width: 1400, // The image width
            height: false, // The image height, or false to auto-calculate it
            isResponsive: true, // Should this image be used on the <picture> responsive element
            customQuery: { // Optionally, for LFS, a custom query to replace the default one
                width: 300,
                path: 'fit&w=300&h=300', 
                width2x: 600,
                path2x: 'fit&w=600&h=600'
            }
        }
        {
            name: 'icon',
            width: 50,
            height: 25,
            isResponsive: false
        },
    ],
}
```


### Using gulp

If your site is not heavy on images, you can use the `image` scripts in order to generate all the needed crops and resizes and `.webp` versions.

This system expects the user to upload to `src/public/images` __only__ the bigger image (i.e, with the default values, 1400px wide @ 2x = 2800px wide). 

It will automatically create a normal and @2k version of four sizes: thumbnail, small, medium and large.. It will also make a `.webp` copy of every file. If it can't enlarge an image, it will silently fail and continue.

As we said before, thumbnail, small, medium and large are the defaults but you can configure the image sizes using `config.sizes` on `images.config.js`.

### Using LFS

Netlify provides support for [large media](https://www.netlify.com/docs/large-media/) using Git LFS.

You will need to set up Git LFS. Follow the instructions on the official Netlify Docs. Do not ever try to fork/copy a repo with an initialized LFS/Large Media: it won't work.

### Image filters

To auto-generate all the markup needed for responsive images (we assume `100w` as the sizes attribute), use the custom `picture` nunjucks filter.

```
    {{ '/path/to/image/asset.png' | picture | safe }}
```

We use `<picture>` instead of the leaner `<img srcset="" >` syntax in order to be able to use a `srcset` for `.webp` (if possible), a `.jpg srcset` fallback for less-capable browsers and finally a `<img>` tag for legacy browsers.

Note that `safe` filter is needed in order to output HTML.

For non-responsive images, an img filter is also provided in order to output both a `.webp` and a `.jpg` version (when possible);

```
    {{ '/path/to/image/asset.png' | img | safe }}
```

#### Wait... what if I use Git LFS?

Both filters can detect which image strategy you're using (`lfs: true` or `false`) and adapt its output accordingly. This way, you can switch between lfs and non-lfs without having to rewrite your codebase. The main difference is that if you're using LFS and Netliy's large media, you'll get queried URLs (inetead of asset links) and you won't get the `webp` version.

## Favicons and PWA

Uploading a `src/assets/img/favicon.jpg` file is mandatory in order to be able to run `yarn pwa` (or `yarn images:favicons`, both start the same gulp task).

This commands will generate all the favicon sizes and all the manifest files for service workers / search engines. 

Please note this command needs to be __manually__ run on every favicon.jpg change because it has been left outside the build process in order to speed it up.

[Configuration reference](https://github.com/itgalaxy/favicons)


## Commands

`yarn build` triggers a complete build of all the static and compiled assets. It will look at the `lfs` value of `images.config.js` to decide wether to perform image conversions.

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

`yarn pwa` and `yarn images:favicons` both run a gulp process that will generate all favicons needed and all the manifest files for service workers / search engines. Please note this command needs to be __manually__ run once on every favicon.jpg change because it is not part of the build process (in order to make it faster).

`yarn js:build` runs a Parcel cli command that takes `/assets/js/script.js` and outputs a `script-bundle.js` file transpiled, tree-shaked and module-bundled.

## TODO

- Rewrite LFS Query handling
- Solve favicons bug
- Add cache buster
- Change gulp-responsive to (more supported?) https://github.com/scalableminds/gulp-image-resize

