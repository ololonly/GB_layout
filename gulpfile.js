const GulpClient = require('gulp');
const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const del = require('del');


scripts = () => {
    return src([
            'node_modules/jquery/dist/jquery.min.js',
            'app/js/app.js'
        ])
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream());
}

browserSyncInit = () => {
    browserSync.init({
        server: { baseDir: 'app/' },
        notify: false,
        online: true
    });
}

styles = () => {
    return src('app/sass/**/*.sass')
        .pipe(sass())
        .pipe(concat('app.min.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 versions'],
            grid: true
        }))
        .pipe(cleanCss({
            level: {
                1: { specialComments: 0 }
            },
            format: 'beautify'
        }))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream());
}

images = () => {
    return src('app/images/src/**/*')
        .pipe(newer('app/images/dest'))
        .pipe(imagemin())
        .pipe(dest('app/images/dest'));
}

cleanimg = () => {
    return del('app/images/dest/**/*', { foce: true });
}

buildCopy = () => {
    return src([
            'app/css/**/*.min.css',
            'app/js/**/*.min.js',
            'app/images/dest/**/*',
            'app/**/*.html'
        ], { base: 'app' })
        .pipe(dest('dist/'));
}

cleandist = () => {
    return del('dist/**/*', { foce: true });
}

startWatch = () => {
    watch('app/**/*.sass', styles);
    watch(['app/**/*.js', '!app/**/*.min.js'], scripts);
    watch('app/**/*.html').on('change', browserSync.reload);
    watch('app/images/src/**/*', images);
}

exports.browserSync = browserSyncInit;
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;
exports.cleanimg = cleanimg;
exports.cleandist = cleandist;
exports.watch = startWatch;
exports.build = series(cleandist, images, styles, scripts, buildCopy);

exports.default = parallel(images, styles, scripts, browserSyncInit, startWatch);