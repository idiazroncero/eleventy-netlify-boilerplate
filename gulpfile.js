'use strict';

// ------
// SETUP, CONFIG, IMPORTS AND GLOBALS
// ------

// Import the image handling config values from our custom config js file.
const { lfs, sizes, sizeNames, sourceDir } = require('./images.config'); 

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

// Image minification.
// Happens in-place (directly on src folder)
function minifyImages() {
    return src('src/public/images/dist/**/*.{png,jpg,jpeg,webp}')
        // .pipe(changed('src/public/images/dist'))
        .pipe(debug({ title : 'Minify'}))
        .pipe(imagemin())
        .pipe(dest('src/public/images/dist'))
};

// Image conversion to webP
function createWebp() {
    return src('src/public/images/dist/**/*.{png,jpg,jpeg}')
        // .pipe(changed('src/public/images/dist'))
        .pipe(debug({ title : 'webp'}))
        .pipe(webp())
		.pipe(dest('src/public/images/dist'))
};

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

// Remove all the generated images. Only the originals will be left.
function cleanImages() {
    return del([
        'src/public/images/dist'
    ])
};

// Generate the gulp-responsive array of sizes based on the user-defined configuration
function generateGulpResponsiveConfiguration(){

    // Loop the sizes array and create an object that fits the gulp-responsive reference
    var responsiveImages = sizes.map(function(item){
        var object = {
            width: item.width,
            rename: function(path) {
                path.dirname += `/${item.name}`;
                return path;
            }
        }
        if(item.height) {
            object.height = item.height;
        }
        return object;
    });

    // Loop the sizes array and create an object that fits the gulp-responsive reference
    // and is a retina version of the former
    var responsiveImages2x = sizes.map(function(item){
        var object = {
            width: item.width * 2,
            rename: function(path) {
                path.dirname += `/${item.name}`;
                path.basename += '@2x';
                return path;
            }
        }
        if(item.height) {
            object.height = item.height * 2;
        }
        return object;
    });
    
    return [ ...responsiveImages, ...responsiveImages2x ];
}


// Generate all the images.
// Beware: This can become a really expensive operation!
function resizeImages() {
    return src('src/public/images/src/**/*.{png,jpg,jpeg}')
        .pipe(dest('src/public/images/dist'))
        .pipe(debug({ title : 'Resize'}))
        // .pipe(changed('src/public/images/dist'))
        .pipe(responsive(
            {
                '**/*.{png,jpg,webp}': generateGulpResponsiveConfiguration()
            },
            // Globals
            {  
                withoutEnlargement: true,
                skipOnEnlargement: true,
                errorOnEnlargement: false, // Change this to allow to skip crops
                quality: 85,
                progressive: true,
                withMetadata: false,
            }
        ))
        .pipe(dest('src/public/images/dist'));
}


// ------
// GULP TASKS
// Define publicly available tasks
// ------

exports.cleanImages = cleanImages;
exports.resizeImages = resizeImages;
exports.minifyImages = minifyImages;
exports.createWebp = createWebp;
exports.generatePwaFavicons = series(generatePwaFavicons, moveFaviconHtml);

// Set the correct processImages task
if(lfs) {
    exports.processImages = series(cleanImages, minifyImages);
} else {
    exports.processImages = series(cleanImages,resizeImages, createWebp, minifyImages);
}