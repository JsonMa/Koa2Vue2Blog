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
    concat = require('gulp-concat'), //- 多个文件合并为一个；
    minifyCss = require('gulp-minify-css'), //- 压缩CSS为一行；
    rev = require('gulp-rev'), //- 对文件名加MD5后缀
    revCollector = require('gulp-rev-collector'),
    uglify = require('gulp-uglify'),
    imageMin = require('gulp-imagemin'),//压缩图片
    pngquant = require('imagemin-pngquant'), // 深度压缩
    clean = require('gulp-clean'), // 文件夹清空
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

// 文件清空
gulp.task('clean-dir', function () {
    gulp.src(['./view-test', './public/css', './public/rev'])
        .pipe(clean())
        .pipe(debug({title: '删除了文件:'}));
    return gulp.start('compile-less-product')
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

// 生产环境编译所有的less
gulp.task('compile-less-product', function () {
    gulp.src('./public/less/**/*.less')
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(less({
            plugins: [autoprefix]
        }))
        .pipe(minifyCss())
        .pipe(rev())
        .pipe(debug({title: '编译了文件:'}))
        .pipe(gulp.dest('./public/css'))
        .pipe(rev.manifest())
        .pipe(debug({title: 'css文件加戳:'}))
        .pipe(gulp.dest('./public/rev'));
    return gulp.start('rev')
});

//压缩js
gulp.task("script",function(){
    gulp.src([ './public/js/**/*.js'])
        .pipe(uglify())
        .pipe(rev())
        .pipe(debug({title: '压缩了文件:'}))
        .pipe(gulp.dest('./public/js/'))
        .pipe(rev.manifest())
        .pipe(debug({title: 'js文件加戳:'}))
        .pipe(gulp.dest('./public/rev'));
    return gulp.start('rev')
});

// 压缩图片
gulp.task('images', function () {
    gulp.src('./public/images/**/*.*')
        .pipe(imageMin({
            progressive: true,// 无损压缩JPG图片
            svgoPlugins: [{removeViewBox: false}], // 不移除svg的viewbox属性
            use: [pngquant()] // 使用pngquant插件进行深度压缩
        }))
        // .pipe(debug({title: '压缩了图片:'}))
        .pipe(gulp.dest('./public/images/'))
});

// 文件替换
gulp.task('rev', function() {
    gulp.src(['./public/rev/*.json', './views/**/*.jade'])
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(gulp.dest('./views/'));
});


// gulp 默认执行代码
gulp.task('default', function() {
    gulp.start('compile-less-all');
    return watch('./public/less/**/*.less', function (event) {
        console.log(event);
        gulp.start('compile-less');
    });
});

// gulp 生产环境执行代码
gulp.task('product', ['compile-less-product','script']);
