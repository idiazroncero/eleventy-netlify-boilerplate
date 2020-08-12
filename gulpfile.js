'use strict';

// ------
// SETUP, CONFIG, IMPORTS AND GLOBALS
// ------

// Import the image handling config values from our custom config js file.
const { sizes, sizeNames, sourceDir } = require('./images.config'); 

// Require gulp core utils and all gulp plugins
const {dest, src, series } = require('gulp');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const responsive = require('gulp-responsive');
const del = require('del');
const favicons = require("gulp-favicons");
const changed = require('gulp-changed');
const debug = require('gulp-debug');

// Require eleventy's metadata
const metadata = require ("./src/_data/metadata.json");

// Require Node.js utils
const fs = require('fs');
const path = require('path');



// ------
// HELPER FUNCTIONS
// ------

// Move a file
function moveFile(file, dir2) {
    //gets file name and adds it to dir2
    var f = path.basename(file);
    var dest = path.resolve(dir2, f);

    fs.rename(file, dest, (err)=>{
        if(err) throw err;
        else console.log('Successfully moved');
    });
};


// ------
// GULP FUNCTIONS
// ------

// Favicon generation, based on a mandatory src/assets/img/favicon.jpg
function generatePwaFavicons() {
    return src("src/assets/img/favicon.jpg")
        .pipe(favicons({
            appName: metadata.title,
            appDescription: metadata.metatags.description,
            developerName: metadata.author.name,
            developerURL: metadata.author.github,
            background: metadata.mobileColor,
            path: "/assets/pwa",
            url: metadata.url,
            display: "standalone",
            orientation: "portrait",
            scope: "/",
            start_url: "/?homescreen=1",
            version: 1.0,
            logging: false,
            html: "favicons.html",
            pipeHTML: true,
            replace: true
    }))
    .pipe(dest("src/assets/pwa"))
}

// Moves the auto-generated favicons.html to the src templates folder 
function moveFaviconHtml() {
    return  src('src/assets/pwa/favicons.html')
            .pipe(dest('src/_includes/components'))
}


// ------
// GULP TASKS
// Define publicly available tasks
// ------
exports.generatePwaFavicons = series(generatePwaFavicons, moveFaviconHtml);