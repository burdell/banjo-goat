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
    dev: '../community-themes/UbntUI/dist/dev/js',
    prod: '../community-themes/UbntUI/dist/prod/js',
    index: {
        toDirectory: '../community-themes/UbntUI/applications/ubnt-forums/views/u/',
        fromDirectory: '../../../dist',
        filename: 'index.php'
    } 
};


var sources = {
	js: ['app/**/*.js'],
    dependencyJs: [
        outputs.dev + '/areas/**/config/*.js',
        outputs.dev + '/areas/**/*.js',
        outputs.dev + '/shared/**/*.module.js',
        outputs.dev + '/shared/**/*.js',
        outputs.dev + '/templates/**/*.js',
        outputs.dev + '/app.init.js'
    ],
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
    .pipe(gulp.dest(outputs.dev));
});

gulp.task('prod-scripts', function(){
    return gulp.src(bowerFiles.concat(sources.dependencyJs))
        .pipe(jsFilter)
        .pipe($.concat('app.min.js'))
        .pipe($.uglify())
        .pipe(gulp.dest(outputs.prod))
        .pipe(jsFilter.restore());
});

gulp.task('partials', function() {
    var partialGlob = gulp.src(sources.partials)
        .pipe($.ngHtml2js({ moduleName: "community-templates" }))
        .pipe(gulp.dest(outputs.dev + '/templates'));
});

gulp.task('bower', function(){
    return gulp.src(bowerFiles)
        .pipe(jsFilter)
        .pipe(gulp.dest(outputs.dev + '/vendor'))
        .pipe(jsFilter.restore());
});

//
//
// INJECT
//
//


gulp.task('inject', ['build'], function () {
    var index = outputs.index;
   	var devLayoutPage = gulp.src(index.toDirectory + index.filename);
    var devAppFiles =   sources.dependencyJs;

    return devLayoutPage
        .pipe($.inject(gulp.src(bowerFiles, { read: false }), {
                name: 'bower',
                ignorePath: 'vendor/bower/',
                addRootSlash: false,
                transform: function(filepath) {
                    var newPath;
                    var cleanFilepath = filepath.replace(/^[/\\\\]?(?:.+[/\\\\]+?)?(.+?)[/\\\\]/, '');
                    var extension = cleanFilepath.split('.').pop();
                    if (extension == 'js') {
                        newPath = '<script src="' + index.fromDirectory + '/dev/js/vendor/' + cleanFilepath + '"></script>';
                    } 
                    return newPath;
                }
            }))
        .pipe($.inject(gulp.src(devAppFiles, { read: false }), { 
            name: 'app',  
            addRootSlash: false, 
            ignorePath: "../community-themes/UbntUI/dist/",
            transform: function(filepath) {
                return '<script src="' + index.fromDirectory + '/' + filepath +'"></script>';
            }  
        }))
        .pipe($.rename(index.filename))
        .pipe(gulp.dest(index.toDirectory));

    // var prodLayoutPage = gulp.src('./dist/prod/index.html');
    // prodLayoutPage = prodLayoutPage
    //     .pipe($.inject(gulp.src(['./prod/css/*.css', './prod/scripts/*.js'], { read: false }), { name: 'app',  addRootSlash: false, ignorePath: "dist/prod/"}))
    //     .pipe($.rename('index.html'))
    //     .pipe(gulp.dest(outputs.prod));

    // return merge(devLayoutPage, prodLayoutPage);
});


//
//
// WATCH
//
//

gulp.task('watch', function () {
	gulp.watch(sources.js, ['scripts']);
	gulp.watch(sources.partials, ['partials']);
	gulp.watch(sources.img, ['img']);
});

//
//
// TASKS
//
//

gulp.task('default', ['dev', 'inject', 'watch']);

gulp.task('dev', ['scripts', 'partials', 'bower']);

gulp.task('build', ['dev'], function(){
    //build prod from dev build
    var jsFilter = $.filter(['**/*.js', '*.js']);
   
    var appFiles = bowerFiles.concat(sources.dependencyJs, ['dist/dev/css/*.css'])
    return gulp.src(appFiles)
        .pipe(jsFilter)
        .pipe($.concat('app.min.js'))
        .pipe($.uglify())
        .pipe(gulp.dest(outputs.prod + outputs.js))
        .pipe(jsFilter.restore());
});
