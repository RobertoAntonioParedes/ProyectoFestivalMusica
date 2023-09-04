
const { src, dest, watch, parallel } = require("gulp");
//CSS
const sass = require("gulp-sass")(require("sass"));
const plumber = require("gulp-plumber");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
//Imagenes
const cache = require("gulp-cache");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const avif = require('gulp-avif');
//javaScript
const terser = require('gulp-terser-js');

function css(done){
    src("src/scss/**/*.scss")    //1. indentificar el archivo SASS (src)
        .pipe(sourcemaps.init())
        .pipe(plumber())    
        .pipe(sass()) 
        .pipe( postcss([ autoprefixer(), cssnano() ]) ) //2. Compilarlo
        .pipe(sourcemaps.write('.'))
        .pipe(dest("build/css")) //3. Almacena en disco duro (dest)

    done();//Callback que avisa a gulp la finalizacion del proceso
}

function imagenes(done){
    const opciones = {
        optimizationLevel: 3
    }
    src('src/img/**/*.{png,jpg}')
        .pipe( cache( imagemin(opciones) ) )
        .pipe( dest( 'build/img'))
    done();
}

function convertirWebp(done){ 
    const opciones ={
        quality:50
    };
    src('src/img/**/*.{png,jpg}')
        .pipe( webp( opciones ) )
        .pipe( dest( 'build/img' ) )
    done();
}

function convertirAvif(done){ 
    const opciones ={
        quality:50
    };
    src('src/img/**/*.{png,jpg}')
        .pipe( avif( opciones ) )
        .pipe( dest( 'build/img' ) )
    done();
}

function javaScript(done){
    src('src/JS**/*.js')
        .pipe(sourcemaps.init())
        .pipe( terser() )
        .pipe(sourcemaps.write('.'))
        .pipe( dest( 'build/js' ) );
    done();
}


function dev(done){
    watch("src/scss/**/*.scss", css);
    watch("src/JS/**/*.js", javaScript);

    done();
}

exports.css = css; 
exports.JS = javaScript; 
exports.convertirWebp = convertirWebp;
exports.imagenes = imagenes;
exports.convertirAvif = convertirAvif;
exports.dev = parallel(imagenes, convertirWebp, convertirAvif, javaScript, dev);