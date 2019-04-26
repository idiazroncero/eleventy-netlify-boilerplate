const { DateTime } = require("luxon");
const CleanCSS = require("clean-css");
const UglifyJS = require("uglify-es");
const htmlmin = require("html-minifier");
const showdown = require('showdown');
const converter = new showdown.Converter();
const fs = require('fs');

//
// HELPERS
//-----------------------

function filePaths(file, size){
  var sourceExt = file.split('.')[1];
  const sourceName = file.split('.')[0];

  const path = sourceDir + '/' + size + '/' + sourceName + '.' + sourceExt;

  if (fs.existsSync(path)) {
    // Check for the 2x images
    var data = {}
    data.has2x = false;
    data.path = relativeSourceDir + '/' + size + '/' + sourceName + '.' + sourceExt;
    data.pathWebp = relativeSourceDir + '/' + size + '/' + sourceName + '.webp';

    const path2x = sourceDir + '/' + size + '/' + sourceName + '@2x.' + sourceExt;
    if (fs.existsSync(path2x)) {
      data.has2x = true;
      data.path2x = relativeSourceDir + '/' + size + '/' + sourceName + '@2x.' + sourceExt;
      data.path2xWebp = relativeSourceDir + '/' + size + '/' + sourceName + '@2x.webp';
    }
    // Return an object containing the original file, the webp, a flag indicating 2x images and 2x images
    return data;
  } else {
    return false;
  }
};

//
// CONFIG
// -----------------------

// Path to the source dir of images
const sourceDir = './src/public/images';
const relativeSourceDir = '/public/images';
const responsiveSizes = ['large', 'medium', 'small'];

module.exports = function(eleventyConfig) {
  eleventyConfig.addLayoutAlias("post", "layouts/post.njk");

  // Date formatting (human readable)
  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("dd LLL yyyy");
  });

  eleventyConfig.addFilter("markdownify", string => {
    var html = converter.makeHtml(string);
    return html;
  });

  eleventyConfig.addFilter("picture", sourceFile => {

    var sizes = {}

    responsiveSizes.forEach(item => {
      const hasItem = filePaths(sourceFile, item);
      if(hasItem) {
        sizes[item]= hasItem.path;
        sizes[item + 'Webp'] = hasItem.pathWebp;
        if(hasItem.has2x) {
          sizes[item + '2x']= hasItem.path2x;
          sizes[item + 'Webp2x'] = hasItem.path2xWebp;
        }
      }
    });

    return `<picture>
              <source type="image/webp"
                srcset="${ sizes.smallWebp ? sizes.smallWebp + ' 480w,' : '' }
                        ${ sizes.smallWebp2x ? sizes.smallWebp2x + ' 960w,' : '' }
                        ${ sizes.mediumWebp ? sizes.mediumWebp + ' 800w,' : '' } 
                        ${ sizes.mediumWebp2x ? sizes.mediumWebp2x + ' 1600w,': '' } 
                        ${ sizes.largeWebp ? sizes.largeWebp + ' 1400w,' : '' }
                        ${ sizes.largeWebp2x ? sizes.largeWebp2x + ' 3800w' : '' }"
                sizes = "100vw"/>
              <source 
              srcset="  ${ sizes.small ? sizes.small + ' 480w,' : '' }
                        ${ sizes.small2x ? sizes.small2x + ' 960w,' : '' }  
                        ${ sizes.medium ? sizes.medium + ' 800w,' : '' } 
                        ${ sizes.medium2x ? sizes.medium2x + ' 1600w,': '' }
                        ${ sizes.large ? sizes.large + ' 1400w,' : '' }
                        ${ sizes.large2x ? sizes.large2x + ' 3800w' : '' }"
                sizes = "100vw"/>
              <img src="${ sizes.large }" />
            </picture>`
  });


  eleventyConfig.addFilter("image", sourceFile => {
    var sourcePointSplit = sourceFile.split('.')
    var webp =  sourcePointSplit[0] + '.webp';
    return `<picture>
              <source type="image/webp" srcset="${ relativeSourceDir + '/' + webp }" />
              <source srcset="${ relativeSourceDir + '/' + sourceFile }" />
              <img src="${ relativeSourceDir + '/' + sourceFile }" />
            </picture>`
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
    if (minified.error) {
      console.log("UglifyJS error: ", minified.error);
      return code;
    }
    return minified.code;
  });

  // Minify HTML output
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if (outputPath.indexOf(".html") > -1) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: false,
      });
      return minified;
    }
    return content;
  });

  // only content in the `posts/` directory
  eleventyConfig.addCollection("posts", function(collection) {
    return collection.getAllSorted().filter(function(item) {
      return item.inputPath.match(/^\.\/src\/posts\//) !== null;
    });
  });

  // Don't process folders with static assets e.g. images
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/public");

  /* Markdown Plugins */
  let markdownIt = require("markdown-it");
  let markdownItAnchor = require("markdown-it-anchor");
  let options = {
    html: true,
    breaks: true,
    linkify: true
  };
  let opts = {
    permalink: false
  };

  eleventyConfig.setLibrary("md", markdownIt(options)
    .use(markdownItAnchor, opts)
  );

  return {
    templateFormats: ["md", "njk", "html", "liquid"],

    // If your site lives in a different subdirectory, change this.
    // Leading or trailing slashes are all normalized away, so don’t worry about it.
    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for URLs (it does not affect your file structure)
    pathPrefix: "/",

    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",

    // Allows copy of non-processed files and folders (assets, etc)
    passthroughFileCopy: true,
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "dist"
    }
  };
};
