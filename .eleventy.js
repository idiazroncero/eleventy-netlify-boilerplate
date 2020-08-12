const { DateTime } = require("luxon");
const CleanCSS = require("clean-css");
const UglifyJS = require("uglify-es");
const htmlmin = require("html-minifier");
const showdown = require('showdown');
const converter = new showdown.Converter();
const pluginPWA = require("eleventy-plugin-pwa");
const cacheBuster = require('@mightyplow/eleventy-plugin-cache-buster');
const Image = require("@11ty/eleventy-img");

//
// CONFIG
// -----------------------

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

  // eleventyConfig.addFilter("picture", pictureFilter );
  // eleventyConfig.addFilter("image", imageFilter );

  eleventyConfig.addNunjucksAsyncShortcode("image", async function(src, alt, outputFormat) {
    if(alt === undefined) {
      // You bet we throw an error on missing alt (alt="" works okay)
      throw new Error(`Missing \`alt\` on myImage from: ${src}`);
    }

    let realSrc = `src/public/images/${src}`;

    // returns Promise
    let stats = await Image(realSrc, {
      formats: [outputFormat],
      urlPath: "public/images/processed",
      outputDir: "src/public/images/processed",
      // Maximum size.
      widths: [1200]
    });

    let props = stats[outputFormat].pop();

    return `<img src="${props.url}" width="${props.width}" height="${props.height}" alt="${alt}">`;
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

  // Plugins
  eleventyConfig.addPlugin(pluginPWA);
  const cacheBusterOptions = {
    outputDirectory: 'dist'
  };
  eleventyConfig.addPlugin(cacheBuster(cacheBusterOptions));

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
