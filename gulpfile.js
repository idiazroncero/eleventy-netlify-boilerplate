'use strict';

// Import and setup
const {dest, src, series, parallel, watch} = require('gulp');
const sass = require('gulp-sass');
const shell = require('child_process').exec;
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const responsive = require('gulp-responsive');
const del = require('del');
sass.compiler = require('node-sass');

// CSS/SASS Compilation
function compileSass() {
  return src('./src/assets/scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(dest('./src/assets/css'));
};

function watchSass() {
  return watch('./src/assets/scss/style.scss', compileSass );
};


// KSS Styleguide
function compileStyleguideSass() {
    return src('./src/assets/scss/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            sourceComments: true,
            outputStype: 'expanded'
        }).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(dest('./src/assets/css/styleguide/')); 
}

function compileStyleguide(cb) {
    shell('yarn kss --source src/assets/css/styleguide --destination docs --css ../src/assets/css/styleguide/styleguide.css --builder node_modules/huesos/src/kss-src', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    })
}


// Image optimization, resizing, etc
function minifyImages() {
    return src('src/assets/img/**/*')
        .pipe(imagemin())
        .pipe(webp())
		.pipe(dest('src/assets/img'))
};

function cleanImages() {
    return del([
        'src/assets/img/**/small',
        'src/assets/img/**/medium',
        'src/assets/img/**/large',
        'src/assets/img/**/thumb',
    ])
};

function resizeImages() {
    return src('src/assets/img/**/*.{png,jpg,webp}')
        .pipe(responsive({
            '**/*.{png,jpg,webp}': 
                [
                    {
                        width: 150,
                        height: 150,
                        rename: function(path) {
                            path.dirname += "/thumb";
                            path.basename += '-thumb';
                            return path;
                        }
                    },
                    {
                        width: 150 * 2,
                        height: 150 * 2,
                        rename: function(path) {
                            path.dirname += "/thumb";
                            path.basename += '-thumb@2x';
                            return path;
                        }
                    },
                    {
                        width: 480 * 2,
                        rename: function(path) {
                            path.dirname += "/small";
                            path.basename += '-small@2x';
                            return path;
                        }
                    },
                    {
                        width: 480,
                        rename: function(path) {
                            path.dirname += "/small";
                            path.basename += '-small';
                            return path;
                        }
                    },
                    {
                        width: 480 * 2,
                        rename: function(path) {
                            path.dirname += "/small";
                            path.basename += '-small@2x';
                            return path;
                        }
                    },
                    {
                        width: 800,
                        rename: function(path) {
                            path.dirname += "/medium";
                            path.basename += '-medium';
                            return path;
                        }
                    },
                    {
                        width: 800 * 2,
                        rename: function(path) {
                            path.dirname += "/medium";
                            path.basename += '-medium@2x';
                            return path;
                        }
                    },
                    {
                        width: 1400,
                        rename: function(path) {
                            path.dirname += "/large";
                            path.basename += '-large';
                            return path;
                        }
                    },
                    {
                        width: 1400 * 2,
                        rename: function(path) {
                            path.dirname += "/large";
                            path.basename += '-large@2x';
                            return path;
                        }
                    },
                ] // End **/*.{png,jpg,webp}
            },
            // Globals
            {  
                withoutEnlargement: true,
                skipOnEnlargement: true,
                errorOnEnlargement: false,
                quality: 85,
                progressive: true,
                withMetadata: false,
            }
        ))
        .pipe(dest('src/assets/img/'));
}

// Validators


// Build Helpers
function runEleventy(cb) {
    shell('yarn eleventy', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    })
}



// Define publicly available tasks
exports.sass = compileSass;
exports.sassWatch = watchSass;
exports.minifyImages = minifyImages;
exports.resizeImages = resizeImages;
exports.cleanImages = cleanImages;

// Grouped tasks
exports.styleguide = compileStyleguide;
exports.fullStyleguide = series(compileStyleguideSass, compileStyleguide);
exports.processImages = series(cleanImages, resizeImages, minifyImages);

// Main build process. Respect the order!
exports.build = series(
    series(cleanImages, resizeImages, minifyImages),
    runEleventy,
    series(compileStyleguideSass, compileStyleguide)
)