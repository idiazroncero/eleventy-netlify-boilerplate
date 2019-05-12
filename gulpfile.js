'use strict';

// Import and setup
const {dest, src, series } = require('gulp');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const responsive = require('gulp-responsive');
const del = require('del');
const { lfs, sizes, sizeNames, sourceDir } = require('./images.config'); 
const favicons = require("gulp-favicons");
const metadata = require ("./src/_data/metadata.json");
const fs = require('fs');
const path = require('path');
var processImages;


// Move file helper
function moveFile(file, dir2) {
    //gets file name and adds it to dir2
    var f = path.basename(file);
    var dest = path.resolve(dir2, f);

    fs.rename(file, dest, (err)=>{
        if(err) throw err;
        else console.log('Successfully moved');
    });
};
  

// Image optimization, resizing, etc
function minifyImages() {
    return src('src/public/images/**/*')
        .pipe(imagemin())
		.pipe(dest('src/public/images'))
};

function createWebp() {
    return src('src/public/images/**/*')
        .pipe(webp())
		.pipe(dest('src/public/images'))
};

// Favicon generator
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

function moveFaviconHtml() {
    return  src('src/assets/pwa/favicons.html')
            .pipe(dest('src/_includes/components/'))
}

// Deleting all generated images
const imageDirs = sizeNames.map(function(item){
    return sourceDir + `/**/${item}`;
})

function cleanImages() {
    return del([
        'src/public/images/**/*.webp',
        ...imageDirs
    ])
};

// Get the image sizes config and generate appropiate styles
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

var responsiveImagesArray = [ ...responsiveImages, ...responsiveImages2x ];

function resizeImages() {
    return src('src/public/images/**/*.{png,jpg,webp}')
        .pipe(responsive(
            {
                '**/*.{png,jpg,webp}': responsiveImagesArray
            },
            // Globals
            {  
                withoutEnlargement: true,
                skipOnEnlargement: true,
                errorOnEnlargement: true, // Change this to allow to skip crops
                quality: 85,
                progressive: true,
                withMetadata: false,
            }
        ))
        .pipe(dest('src/public/images'));
}



// Define publicly available tasks
exports.cleanImages = cleanImages;
exports.resizeImages = resizeImages;
exports.minifyImages = minifyImages;
exports.createWebp = createWebp;
exports.generatePwaFavicons = series(generatePwaFavicons, moveFaviconHtml);

// Set the correct processImages task

if(lfs) {
    processImages = series(cleanImages, minifyImages);
} else {
    processImages = series(cleanImages, resizeImages, createWebp, minifyImages);
}

// Grouped tasks
exports.processImages = processImages;