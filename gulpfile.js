var gulp = require('gulp');
var del = require('del');
var merge = require('merge-stream');
var gulpLoadPlugins = require('gulp-load-plugins');
var $ = gulpLoadPlugins({
    scope: ['devDependencies']
});

var mainBowerFiles = require('main-bower-files');
var bowerFiles = mainBowerFiles({ includeDev: true });

//
//
// FILTERS
//
//

var jsFilter = $.filter(['**/*.js', '*.js']);
var cssFilter = $.filter(['**/*.css', '*.css']);
var imgFilter = $.filter(['/**/*.png', '*.png', '**/*.gif']);
var sassFilter = $.filter(['/**/*.scss', '*.scss']);
var fontFilter = $.filter(['**/**/*.ttf', '*.ttf', '**/**/*.woff', '*.woff']);

//
//
// SOURCES
//
//

var sources = {
  index: 'Spa/UnitySpa.html',
	js: ['app/**/*.js'],
	fonts: ['Content/**/*.ttf'],
	img: ['content/**/*.png'],
	sass: ['app/styles/*.scss'],
	partials: [
		'app/areas/**/*.html',
        'app/shared/**/*.html',
        'app/layout/**/*.html',
        '!app/index.html'
	]
};

//
//
// BUILD
//
//

gulp.task('index', function () {
    return gulp.src(sources.index)
        .pipe($.rename("index.html"))
        .pipe(gulp.dest('dist/dev/'))
        .pipe(gulp.dest('dist/prod/'));
});

//
//
// BUILD TASKS
//
//

gulp.task('scripts', function() {
  return gulp.src(sources.js)
    .pipe(gulp.dest('dist/dev/scripts'))
    .pipe($.uglify())
    .pipe($.concat('app.min.js'))
    .pipe(gulp.dest('dist/prod/scripts'));
});

gulp.task('sass', function() {
    return gulp.src(sources.sass)
        .pipe($.compass({ sass: './app/styles/', css: 'dist/dev/css' }))
        .pipe($.concat('styles.min.css'))
        .pipe($.minifyCss())
        .pipe(gulp.dest('dist/prod/css'));
});

gulp.task('partials', function() {
    var partialGlob = gulp.src(sources.partials)
        .pipe($.ngHtml2js({ moduleName: "community-templates" }));

    return partialGlob
        .pipe(gulp.dest('dist/dev/partials'))
        .pipe($.uglify())
        .pipe($.concat('partials.min.js'))
        .pipe(gulp.dest('dist/prod/partials'));
});

gulp.task('img', function() {
    return gulp.src(sources.img)
        .pipe(gulp.dest('dist/dev/img'))
        .pipe(gulp.dest('dist/prod/img'));
});

gulp.task('bower', function() {
      //bower js files
    var bowerGlob = gulp.src(bowerFiles); 
    bowerGlob = bowerGlob
        .pipe(jsFilter)
        .pipe($.concat('lib.min.js'))
        .pipe(gulp.dest('dist/dev/vendor/js'))
        .pipe($.uglify())
        .pipe(gulp.dest('dist/prod/vendor/js'))
        .pipe(jsFilter.restore());

    //bower css files
    bowerGlob = bowerGlob
        .pipe(cssFilter)
        .pipe(gulp.dest('dist/dev/vendor/css'))
        .pipe($.minifyCss())
        .pipe($.concat('lib.min.css'))
        .pipe(gulp.dest('dist/prod/vendor/css'))
        .pipe(cssFilter.restore());

    //bower image files
    bowerGlob = bowerGlob
        .pipe(imgFilter)
        .pipe(gulp.dest('dist/dev/vendor/css'))
        .pipe(gulp.dest('dist/prod/vendor/css'))
        .pipe(imgFilter.restore());;

    //bower font files
    bowerGlob = bowerGlob
      .pipe(fontFilter)
      .pipe(gulp.dest('dist/dev/vendor/css/fonts'))
      .pipe(gulp.dest('dist/prod/vendor/css/fonts')); 

    return bowerGlob;
});

//
//
// INJECT
//
//

var injectHelper = function(source) {
    var devLayoutPage = gulp.src('./dist/dev/' + source);

    devLayoutPage = devLayoutPage.pipe($.inject(gulp.src(bowerFiles, { read: false }), {
        name: 'bower',
        ignorePath: 'bower_components/',
        addRootSlash: false,
        transform: function(filepath) {
            var newPath;
            var cleanFilepath = filepath.replace(/^[/\\\\]?(?:.+[/\\\\]+?)?(.+?)[/\\\\]/, '');
            var extension = cleanFilepath.split('.').pop();
            if (extension == 'js') {
                newPath = '<script src="/dist/dev/vendor/js/' + cleanFilepath + '"></script>';
            } else if (extension == 'css') {
                newPath = '<link rel="stylesheet" href="/dist/dev/vendor/css/' + cleanFilepath + '">';
            }
            return newPath;
        }
    }));

    var devAppFiles = 	['dist/dev/scripts/*.js', 'dist/dev/scripts/**/*.js', 'dist/dev/partials/**/**/*.js', '!dist/dev/scripts/Routes.js'];
    if (source == 'index.html') devAppFiles.unshift('dist/dev/css/**/*.css');

    devLayoutPage = devLayoutPage
    	.pipe($.inject(gulp.src(devAppFiles, { read: false }), { name: 'app', addRootSlash: true }))
      .pipe($.replace("{{ buildEnvironment }}", 'dev'))
    	.pipe($.rename(source))
    	.pipe(gulp.dest('./dist/dev'));

    var prodLayoutPage = gulp.src('./dist/prod/' + source);

    prodLayoutPage = prodLayoutPage.pipe($.inject(gulp.src(['dist/prod/vendor/**/*.css', 'dist/prod/vendor/**/*.js'],
        { read: false }), { name: 'bower', addRootSlash: true }));

    var prodAppFiles = ['dist/prod/scripts/*.js', 'dist/prod/scripts/**/*.js', 'dist/prod/partials/**/**/*.js'];
    if (source == 'index.html') prodAppFiles.unshift('dist/prod/css/**/*.css');

    prodLayoutPage = prodLayoutPage
    	.pipe($.inject(gulp.src(prodAppFiles, { read: false }), { name: 'app', addRootSlash: true }))
      .pipe($.replace("{{ buildEnvironment }}", 'prod'))
    	.pipe($.rename(source))
    	.pipe(gulp.dest('./dist/prod'));

    return merge(devLayoutPage, prodLayoutPage);
};

var injectHelperHelper = function(){
    var index = injectHelper('index.html');
    var emptyLayout = injectHelper('EmptyLayout.html');
    return merge(index, emptyLayout);
}

gulp.task('inject', ['build'], function () {
   	return injectHelperHelper();
});

gulp.task('no-build-inject', function(){
    return injectHelperHelper();
});

//
//
// WATCH
//
//

gulp.task('watch', function () {
	gulp.watch(sources.js, ['scripts']);
	gulp.watch(sources.less, ['less']);
	gulp.watch(sources.partials, ['partials']);
	gulp.watch(sources.img, ['img']);
});

//
//
// TASKS
//
//

gulp.task('default', ['build', /*'inject', 'watch'*/]);

gulp.task('build', ['scripts', 'sass', 'partials', 'img', 'bower']);
