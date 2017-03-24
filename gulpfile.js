/**
 * Created by Administrator on 2017/3/12.
 */
var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'), // 该插件用于处理less的文件引用,
    plumber = require('gulp-plumber'), // 该插件用于编译错误时可不终止watch
    changedInPlace = require('gulp-changed-in-place'), // 该插件用于只编译改动的文件
    less = require('gulp-less'),
    watch = require('gulp-watch'),
    notify = require('gulp-notify'), // 该插件用于告知信息
    LessAutoprefix = require('less-plugin-autoprefix'),
    autoprefix = new LessAutoprefix({
        browsers: ["last 2 versions", "iOS >= 4", "ie > 8", "firefox >= 15"],
        cascade: true
    }),
    debug = require('gulp-debug'); // 改插件用于打印被编译的文件;
const sourceMapPath = './maps';

// 编译less
gulp.task('compile-less', function () {
    gulp.src('./public/less/**/*.less')
        .pipe(sourcemaps.init())
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(changedInPlace()) // 用于编译改动的文件
        .pipe(less({
            plugins: [autoprefix]
        }))
        .pipe(sourcemaps.write(sourceMapPath))
        .pipe(debug({title: '编译了文件:'}))
        .pipe(gulp.dest('./public/css'));
});

// 编译所有less
gulp.task('compile-less-all', function () {
    gulp.src('./public/less/**/*.less')
        .pipe(sourcemaps.init())
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(less({
            plugins: [autoprefix]
        }))
        .pipe(sourcemaps.write(sourceMapPath))
        .pipe(debug({title: '编译了文件:'}))
        .pipe(gulp.dest('./public/css'));
});

// gulp 默认执行代码
gulp.task('default', function() {
    gulp.start('compile-less-all'); // 调用compile-less任务，编译less文件
    return watch('./public/less/**/*.less', function (event) {
        console.log(event);
        gulp.start('compile-less');
    });
});