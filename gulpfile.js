const { src, dest, parallel, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const nunjucksRender = require('gulp-nunjucks-render');
const purgeCSS = require('gulp-purgecss'); //чистка цсс от неиспользуемых в разметке классов
const prettify = require('gulp-prettify'); //форматирование итогового хтмл для читаемости
const destroy = require('del');
const archivate = require('gulp-zip');

const projectName = require('./package.json').name;
const projectVersion = require('./package.json').version;

function clean() {
    return destroy(['./dist', './build'])
}

function styles() {
    return src(`./src/styles/styles.scss`)
        .pipe(sass({
            style: 'compressed'
        }).on('error', sass.logError))
        .pipe(dest(`./dist`))
        .pipe(browserSync.stream());
}

function build() {
    return src('./dist/**', {encoding: false})
        .pipe(archivate(`${projectName+'-'+projectVersion}.zip`))
        .pipe(dest(`./build`))
}

function purgecss() {
    return src(`./dist/styles.css`)
        .pipe(purgeCSS({
            content: ['./dist/*.html'],
        }))
        .pipe(dest(`./dist`))
}

function html() {
    return src(`./src/pages/*.html`)
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

function copySCSS() {
    return src(`./src/styles/**/*.scss`)
        .pipe(dest(`./dist/scss`))
}

function scripts() {
    return src(`./src/scripts/*.js`)
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

function observer() {
    watch("./src/styles/**/*.scss", series(styles, purgecss)).on('change', browserSync.reload);
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
exports.copyscss = copySCSS
exports.clean = clean

const compileDist = parallel(styles, scripts, images, fonts, html, copySCSS);

//выполнение сценария по умолчанию
exports.dev = series(clean, compileDist, purgecss, parallel(browsersync, observer));
//финальный билд в архиве на чек
exports.build = build