const gulp = require('gulp');
const { parallel } = gulp;
const gulpWatch = gulp.watch;
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

sass.compiler = require('node-sass');

function jsTranspile(callback) {
  // On écoute les modifications de tous les fichiers `.js` dans le dossier `src/js`.
  gulp.src('src/js/*.js')
    // Puis on le passe dans le module webpack pour le transpiler
    // et le minifier si le mode configuré dans le fichier `webpack.config.js`.
    // est défini sur "production".
    .pipe(webpackStream(webpackConfig, webpack))
    // On place le fichier de sortie dans le dossier `assets/js`.
    .pipe(gulp.dest('assets/js'));

  // On a fini la transpilation JS, on peut déclencher le callback.
  callback();
}

function cssTranspile(callback) {
// On écoute les modifications de tous les fichiers `.css` et `.scss` dans le dossier `src/scss`.
  gulp.src([
    'src/scss/*.scss',
    'src/scss/*.css',
  ])
    // On commence la transpilation CSS.
    .pipe(sass().on('error', sass.logError))
    // On fusionne tous les fichiers en un seul.
    .pipe(concat('style.css'))
    // On rend le CSS compatible avec les navigateurs jusqu'à IE8.
    .pipe(cleanCSS({compatibility: 'ie8'}))
    // On place le fichier de sortie dans le dossier `assets/css`.
    .pipe(gulp.dest('assets/css'));

  // On a fini la transpilation CSS, on peut déclencher le callback.
  callback();
}

function watch(callback) {
  gulpWatch('src/scss/*.scss', cssTranspile);
  gulpWatch('src/js/*.js', jsTranspile);
  callback();
}

exports.watch = parallel(
  cssTranspile,
  jsTranspile,
  watch,
);

exports.build = parallel(
  cssTranspile,
  jsTranspile,
);
