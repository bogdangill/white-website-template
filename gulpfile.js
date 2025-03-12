const { src, dest, parallel, series, watch } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const browserSync = require('browser-sync').create()

function styles() {
    return src(`./css/styles.scss`)
        .pipe(sass({
            outputStyle: "expanded"
        }))
        .pipe(dest(`./css`))
        .pipe(browserSync.stream());
}

function html() {
    return src(`./*.html`) 
        .pipe(browserSync.stream());
}

function scripts() {
    return src(`./js/script.js`, { sourcemaps: true })
        .pipe(browserSync.stream());
}

function browsersync() {
    browserSync.init({
        server: {
            baseDir: `./`,
            notify: false,
            port: 3000,
        }
    })
}

async function images() {
    return src(`./assets/img/**/*.+(png|jpg|gif|ico|svg|webp)`)
        .pipe(browserSync.stream());
}

function watcher() {
    watch("./css/*.scss", styles).on('change', browserSync.reload);
    watch("./*.html", html).on('change', browserSync.reload);
    watch("./js/**/*.js", scripts);
    watch("./assets/img/**/*.{png, jpeg, jpg, webp, svg}", images);
}

exports.browsersync = browsersync
exports.scripts = scripts
exports.styles = styles
exports.html = html
exports.images = images

//выполнение сценария по умолчанию
exports.dev = parallel(styles, scripts, images, html, browsersync, watcher);