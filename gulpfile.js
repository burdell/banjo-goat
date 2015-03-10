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

var outputs = {
    base: 'dist',
    dev: 'dist/dev',
    prod: 'dist/prod',
    js: '/js',
    css: '/css',
    img: '/img'
};


var sources = {
	js: ['app/**/*.js'],
    dependencyJs: [
        outputs.dev + outputs.js + '/areas/**/config/*.js',
        outputs.dev + outputs.js + '/areas/**/*.js',
        outputs.dev + outputs.js + '/shared/**/*.module.js',
        outputs.dev + outputs.js + '/shared/**/*.js',
        outputs.dev + outputs.js + '/templates/**/*.js',
        outputs.dev + outputs.js + '/app.init.js'
    ],
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
    return gulp.src('app/index.html')
        .pipe($.rename("index.html"))
        .pipe(gulp.dest(outputs.dev))
        .pipe(gulp.dest(outputs.prod));
});

gulp.task('clean', function(){
    del([outputs.base]);
});

//
//
// BUILD TASKS
//
//

gulp.task('scripts', function() {
  return gulp.src(sources.js)
    .pipe(gulp.dest(outputs.dev + outputs.js));
});

gulp.task('prod-scripts', function(){
    return gulp.src(bowerFiles.concat(sources.dependencyJs))
        .pipe(jsFilter)
        .pipe($.concat('app.min.js'))
        .pipe($.uglify())
        .pipe(gulp.dest(outputs.prod + outputs.js))
        .pipe(jsFilter.restore());
});

gulp.task('styles', function() {
    return gulp.src(sources.sass)
        .pipe($.compass({ sass: './app/styles/', css: outputs.dev + outputs.css }))
        .pipe($.concat('styles.min.css'));
});

gulp.task('prod-styles', function(){
    return gulp.src(bowerFiles.concat([outputs.dev + outputs.css + '/*.css']))
        .pipe(cssFilter)
        .pipe($.minifyCss())
        .pipe($.rename('app.min.css'))
        .pipe(gulp.dest(outputs.prod + outputs.css))
        .pipe(cssFilter.restore());
});

gulp.task('partials', function() {
    var partialGlob = gulp.src(sources.partials)
        .pipe($.ngHtml2js({ moduleName: "community-templates" }))
        .pipe(gulp.dest(outputs.dev + outputs.js + '/templates'));
});

gulp.task('img', function() {
    return gulp.src(sources.img)
        .pipe(gulp.dest(outputs.dev + outputs.img))
        .pipe(gulp.dest(outputs.prod + outputs.img));
});

gulp.task('bower', function(){
    return gulp.src(bowerFiles)
        .pipe(jsFilter)
        .pipe(gulp.dest(outputs.dev + outputs.js + '/vendor'))
        .pipe(jsFilter.restore());
});

//
//
// INJECT
//
//


gulp.task('inject', ['build'], function () {
   	var devLayoutPage = gulp.src('./dist/dev/index.html');
    var devAppFiles =   sources.dependencyJs.concat(['dist/dev/css/**/*.css']);

    devLayoutPage = devLayoutPage
        .pipe($.inject(gulp.src(bowerFiles, { read: false }), {
                name: 'bower',
                ignorePath: 'vendor/bower/',
                addRootSlash: false,
                transform: function(filepath) {
                    var newPath;
                    var cleanFilepath = filepath.replace(/^[/\\\\]?(?:.+[/\\\\]+?)?(.+?)[/\\\\]/, '');
                    var extension = cleanFilepath.split('.').pop();
                    if (extension == 'js') {
                        newPath = '<script src="js/vendor/' + cleanFilepath + '"></script>';
                    } else if (extension == 'css') {
                        newPath = '<link rel="stylesheet" href="css/vendor/' + cleanFilepath + '">';
                    }
                    return newPath;
                }
            }))
        .pipe($.inject(gulp.src(devAppFiles, { read: false }), { name: 'app',  addRootSlash: false, ignorePath: "dist/dev/"  }))
        .pipe($.rename('index.html'))
        .pipe(gulp.dest('./dist/dev'));

    var prodLayoutPage = gulp.src('./dist/prod/index.html');
    var prodFiles = 
    prodLayoutPage = prodLayoutPage
        .pipe($.inject(gulp.src(['./prod/css/*.css', './prod/scripts/*.js'], { read: false }), { name: 'app',  addRootSlash: false, ignorePath: "dist/prod/"}))
        .pipe($.rename('index.html'))
        .pipe(gulp.dest(outputs.prod));

    return merge(devLayoutPage, prodLayoutPage);
});


//
//
// WATCH
//
//

gulp.task('watch', function () {
	gulp.watch(sources.js, ['scripts']);
	gulp.watch(sources.sass, ['sass']);
	gulp.watch(sources.partials, ['partials']);
	gulp.watch(sources.img, ['img']);
});

//
//
// TASKS
//
//

gulp.task('default', ['index', 'build', 'inject', 'watch']);

gulp.task('dev', ['scripts', 'styles', 'partials', 'img']);

gulp.task('build', ['dev', 'bower'], function(){
    //build prod from dev build
    var jsFilter = $.filter(['**/*.js', '*.js']);
    var cssFilter = $.filter(['**/*.css', '*.css']);
    // var imgFilter = $.filter(['/**/*.png', '*.png', '**/*.gif']);
    // var sassFilter = $.filter(['/**/*.scss', '*.scss']);
    // var fontFilter = $.filter(['**/**/*.ttf', '*.ttf', '**/**/*.woff', '*.woff']);

    var appFiles = bowerFiles.concat(sources.dependencyJs, ['dist/dev/css/*.css'])
    return gulp.src(appFiles)
        .pipe(jsFilter)
        .pipe($.concat('app.min.js'))
        .pipe($.uglify())
        .pipe(gulp.dest(outputs.prod + outputs.js))
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.minifyCss())
        .pipe($.rename('app.min.css'))
        .pipe(gulp.dest(outputs.prod + outputs.css))
        .pipe(cssFilter.restore());
});
