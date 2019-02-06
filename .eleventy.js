const { DateTime } = require("luxon");
const CleanCSS = require("clean-css");
const UglifyJS = require("uglify-js");
const htmlmin = require("html-minifier");

module.exports = function(eleventyConfig) {

  eleventyConfig.addLayoutAlias("post", "layouts/post.njk");

  // Date formatting (human readable)
  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("dd LLL yyyy");
  });

  eleventyConfig.addFilter("picture", sourceFile => {
    var sourcePointSplit = sourceFile.split('.')
    var sourceBarSplit = sourceFile.split('/')
    var sourceExt = sourcePointSplit[1];
    var sourceFullName = sourceBarSplit[sourceBarSplit.length - 1];
    var sourceName = sourceFullName.split('.')[0];
    var sourceDirArray = sourceBarSplit.filter(function(item, index){
      return index < (sourceBarSplit.length - 1)
    });
    var sourceDir = sourceDirArray.join('/');
    var sizes = {
      small: sourceDir + '/small/' + sourceName + '-small.' + sourceExt,
      small2x: sourceDir + '/small/' + sourceName + '-small@2x.' + sourceExt,
      smallWebp: sourceDir + '/small/' + sourceName + '-small.webp',
      smallWebp2x: sourceDir + '/small/' + sourceName + '-small@2x.webp',
      medium: sourceDir + '/medium/' + sourceName + '-medium.' + sourceExt,
      medium2x: sourceDir + '/medium/' + sourceName + '-medium@2x.' + sourceExt,
      mediumWebp: sourceDir + '/medium/' + sourceName + '-medium.webp',
      mediumWebp2x: sourceDir + '/medium/' + sourceName + '-medium@2x.webp',
      large: sourceDir + '/large/' + sourceName + '-large.' + sourceExt,
      large2x: sourceDir + '/large/' + sourceName + '-large@2x.' + sourceExt,
      largeWebp: sourceDir + '/large/' + sourceName + '-large.webp',
      largeWebp2x: sourceDir + '/large/' + sourceName + '-large@2x.webp'
    }
    var html = `<picture>
        <source type="image/webp"
          srcset="${ sizes.smallWebp } 480w,
                  ${ sizes.smallWebp2x } 960w,
                  ${ sizes.mediumWebp } 800w,
                  ${ sizes.mediumWebp2x } 1600w,
                  ${ sizes.largeWebp } 1400w,
                  ${ sizes.largeWebp2x } 2800w"
          sizes = "100vw
                  "
          />
        <source 
        srcset="${ sizes.smallWebp } 480w,
                ${ sizes.smallWebp2x } 960w,
                ${ sizes.mediumWebp } 800w,
                ${ sizes.mediumWebp2x } 1600w,
                ${ sizes.largeWebp } 1400w,
                ${ sizes.largeWebp2x } 2800w"
          sizes = "100vw
                  "
          />
        <img src="${ sizes.large }" />
      </picture>`
    return html;
  });


  eleventyConfig.addFilter("img", sourceFile => {
    var sourcePointSplit = sourceFile.split('.')
    var webp = sourcePointSplit[0] + '.webp';
    var html = `<picture>
        <source type="image/webp" srcset="${  webp }" />
        <source srcset="${ sourceFile }" />
        <img src="${ sourceFile }" />
      </picture>`
    return html;
  });

  // Date formatting (machine readable)
  eleventyConfig.addFilter("machineDate", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("yyyy-MM-dd");
  });

  // Minify CSS
  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // Minify JS
  eleventyConfig.addFilter("jsmin", function(code) {
    let minified = UglifyJS.minify(code);
    if( minified.error ) {
      console.log("UglifyJS error: ", minified.error);
      return code;
    }
    return minified.code;
  });

  // Minify HTML output
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if( outputPath.indexOf(".html") > -1 ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });

  // only content in the `posts/` directory
  eleventyConfig.addCollection("posts", function(collection) {
    return collection.getAllSorted().filter(function(item) {
      return item.inputPath.match(/^\.\/posts\//) !== null;
    });
  });

  // Don't process folders with static assets e.g. images
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin");

  /* Markdown Plugins */
  let markdownIt = require("markdown-it");
  let options = {
    html: true,
    breaks: true,
    linkify: true
  };
  let opts = {
    permalink: true,
    permalinkClass: "direct-link",
    permalinkSymbol: "#"
  };

  return {
    templateFormats: [
      "md",
      "njk",
      "html"
    ],

    // If your site lives in a different subdirectory, change this.
    // Leading or trailing slashes are all normalized away, so don’t worry about it.
    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for URLs (it does not affect your file structure)
    pathPrefix: "/",

    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    passthroughFileCopy: true,
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "dist"
    }
  };
};
