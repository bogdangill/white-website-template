const { src, dest, parallel, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const nunjucksRender = require('gulp-nunjucks-render');
const fs = require('node:fs');
const data = require('gulp-data');
const purgeCSS = require('gulp-purgecss'); //чистка цсс от неиспользуемых в разметке классов
const prettify = require('gulp-prettify'); //форматирование итогового хтмл для читаемости

function styles() {
    return src(`./src/styles/styles.scss`, {sourcemaps: true})
        .pipe(sass({
            outputStyle: "expanded"
        }))
        .pipe(dest(`./dist/styles`, {sourcemaps: true}))
        .pipe(browserSync.stream());
}

function purgecss() {
    return src(`./dist/styles/styles.css`)
        .pipe(purgeCSS({
            content: ['./dist/*.html']
        }))
        .pipe(dest(`./dist/styles`))
}

function html() {
    return src(`./src/pages/*.html`)
        // добавление текстов из json словаря
        .pipe(data(function() {
            return JSON.parse(fs.readFileSync('./src/data/data.json'))
        }))
        .pipe(nunjucksRender({
            path: "./src/pages/blocks/" //можно и просто строку
        }))
        .pipe(prettify(
            {
                indent_size: 4,
                indent_char: ' ',
                inline: [], // перенос строки для всех инлайн элементов
                end_with_newline: true // перенос строки в конце файла
            }
        ))
        .pipe(dest(`./dist/`))
        .pipe(browserSync.stream());
}

function scripts() {
    return src(`./src/scripts/script.js`, { sourcemaps: true })
        .pipe(dest(`./dist/scripts`))
        .pipe(browserSync.stream());
}

function fonts() {
    return src(`./src/fonts/*.woff2`)
        .pipe(dest(`./dist/fonts`))
}

function browsersync() {
    browserSync.init({
        server: {
            baseDir: `./dist`,
            notify: false,
            port: 3000,
        }
    })
}

async function images() {
    return src(`./src/images/**/*.+(png|jpg|gif|ico|svg|webp)`)
        .pipe(dest(`./dist/images`))
        .pipe(browserSync.stream());
}

function watcher() {
    watch("./src/styles/**/*.scss", styles).on('change', browserSync.reload);
    watch("./src/pages/**/*.html", html).on('change', browserSync.reload);
    watch("./src/scripts/**/*.js", scripts);
    watch("./src/images/**/*.{png, jpeg, jpg, webp, svg}", images);
}

exports.browsersync = browsersync
exports.scripts = scripts
exports.styles = styles
exports.html = html
exports.images = images
exports.fonts = fonts
exports.purgecss = purgecss

//выполнение сценария по умолчанию
exports.dev = parallel(styles, scripts, images, fonts, html, browsersync, watcher);