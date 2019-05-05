'use strict';

// Import and setup
const {dest, src, series } = require('gulp');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const responsive = require('gulp-responsive');
const del = require('del');
const { sizes, sizeNames, sourceDir } = require('./images.config'); 

// Image optimization, resizing, etc
function minifyImages() {
    return src('src/public/images/**/*')
        .pipe(imagemin())
        .pipe(webp())
		.pipe(dest('src/public/images'))
};

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

// Grouped tasks
exports.processImages = series(cleanImages, resizeImages, minifyImages);