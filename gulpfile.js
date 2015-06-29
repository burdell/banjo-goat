var gulp = require('gulp');
var del = require('del');
var merge = require('merge-stream');
var _ = require('underscore');
var gulpLoadPlugins = require('gulp-load-plugins');
var $ = gulpLoadPlugins({
    scope: ['devDependencies']
});
var packageJSON = require('./package');

var mainBowerFiles = require('main-bower-files');
var bowerFiles = mainBowerFiles({ includeDev: true });

//plugins where we want to move the entire plugin folder
var wholeFolderPlugins = ['vendor/bower/tinymce/**'];


//
//
// FILTERS
//
//

var jsFilter = $.filter(['**/*.js', '*.js']);
var cssFilter = $.filter(['**/*.css', '']);
var imgFilter = $.filter(['/**/*.png', '*.png', '**/*.gif']);
var sassFilter = $.filter(['/**/*.scss', '*.scss']);
var fontFilter = $.filter(['**/**/*.ttf', '*.ttf', '**/**/*.woff', '*.woff']);

//
//
// SOURCES
//
//
var devOutput = './dist/dev';
var prodOutput = './dist/prod';
var outputs = {
    dev: devOutput,
    prod: prodOutput,
    devJs: devOutput + '/js/',
    prodJs: prodOutput + '/js/',
    devCss: devOutput + '/css/'
};


var sources = {
    index: 'app/index.html',
	js: ['app/**/*.js'],
    dependencyJs: [
        outputs.devJs + 'areas/**/config/*.js',
        outputs.devJs + 'areas/**/*.js',
        outputs.devJs + 'shared/**/*.module.js',
        outputs.devJs + 'shared/**/*.js',
        outputs.devJs + 'templates/**/*.js',
        outputs.devJs + 'app.init.js'
    ],
    css: [outputs.devCss + '**/*.css'],
	sass: ['assets/**/*.scss'],
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
    del(['./dist/', './app/design/community.css']);
});

//
//
// BUILD TASKS
//
//

function areaBuilder(taskFn){
    var areas = ['forums', 'announcements', 'stories'];

    _.each(areas, function(areaName){
        taskFn(areaName);
    });
}

function areaPath(areaName) {
    return outputs.dev + '/' + areaName;
}

gulp.task('index', function(){
    areaBuilder(function(areaName){
        gulp.src(sources.index)
            .pipe($.replace('{{GULP_BUILD_areaName}}', areaName))
            .pipe($.rename('index.html'))
            .pipe(gulp.dest(areaPath(areaName)));
    });
});

/****  
        SCRIPT TASKS 
                        *****/
gulp.task('init-script', function(){
    areaBuilder(function(areaName) {
         gulp.src([ 'app/app.init.js'])
            .pipe($.replace('{{GULP_BUILD_areaName}}', areaName))
            .pipe(gulp.dest(areaPath(areaName) + '/js/'));
    });
})

gulp.task('shared-scripts', function(){
    areaBuilder(function(areaName){
        gulp.src([ 'app/shared/**/*.js'])
            // .pipe($.jshint(packageJSON.jshintConfig))
            // .pipe($.jshint.reporter("jshint-stylish"))
            // .pipe($.jshint.reporter('fail'))
            .pipe(gulp.dest(areaPath(areaName) + '/js/shared'));
    });
});

gulp.task('scripts', ['shared-scripts', 'init-script'], function() {
    areaBuilder(function(areaName){
        gulp.src([ 'app/areas/' + areaName + '/**/*.js' ])
        // .pipe($.jshint(packageJSON.jshintConfig))
        // .pipe($.jshint.reporter("jshint-stylish"))
        // .pipe($.jshint.reporter('fail'))
        .pipe(gulp.dest(areaPath(areaName) + '/js/'));
    });
});

gulp.task('prod-scripts', function(){
    return gulp.src(bowerFiles.concat(sources.dependencyJs))
        .pipe(jsFilter)
        .pipe($.concat('app.min.js'))
        .pipe($.uglify())
        .pipe(gulp.dest(outputs.prod))
        .pipe(jsFilter.restore());
});


/**** 
        TEMPLATE TASKS 
                        *****/
gulp.task('shared-templates', function(){
     var templateBlob = gulp.src(['app/shared/**/*.html', '!app/index.html'])
            .pipe($.ngHtml2js({ moduleName: "community.templates" }));

    areaBuilder(function(areaName) {
        templateBlob
            .pipe(gulp.dest(areaPath(areaName) + '/js/templates'));
    });
});

gulp.task('templates', ['shared-templates'], function() {
    areaBuilder(function(areaName){
        gulp.src(['app/areas/' + areaName + '/**/*.html','!app/index.html'])
            .pipe($.ngHtml2js({ moduleName: "community.templates", prefix: areaName + '/' }))
            .pipe(gulp.dest(areaPath(areaName) + '/js/templates'));
    });
});

/***** 
        STYLE TASKS 
                        ******/

gulp.task('compile-stylesheets', function(){
    return gulp.src(sources.sass)
        .pipe($.compass({
           css: 'app/design',
           sass: 'assets/sass'
    }));
});

gulp.task('stylesheets', ['compile-stylesheets'], function(){
    areaBuilder(function(areaName){
        gulp.src('app/design/*.css')
            .pipe(gulp.dest(areaPath(areaName) + '/css'));
    });
});

/****** 
            VENDOR TASKS 
                            ******/
gulp.task('whole-plugin-folders', function(){
    areaBuilder(function(areaName) {
        gulp.src(wholeFolderPlugins, { base: 'vendor/bower/' })
            .pipe(gulp.dest(areaPath(areaName) + '/js/vendor/'))
    });    
});

gulp.task('bower', ['whole-plugin-folders'], function(){ 
    areaBuilder(function(areaName){
        gulp.src(bowerFiles)
            .pipe(jsFilter)
            .pipe(gulp.dest(areaPath(areaName) + '/js/vendor'))
            .pipe(jsFilter.restore())
            .pipe(cssFilter)
            .pipe(gulp.dest(areaPath(areaName) + '/css/vendor'))
            .pipe(cssFilter.restore());
            // .pipe(imgFilter)
            // .pipe(gulp.dest(outputs.devCss + '/vendor'))
            // .pipe(imgFilter.restore());
    });
});

//
//
// INJECT
//
//

gulp.task('inject', ['dev'], function () {
    var fileDependencyOrder = [
        'js/**/*.module.js',
        'js/config/*.js',
        'js/**/*.js',
        '!js/app.init.js',
        '!js/vendor/**/*.js'
    ];

    areaBuilder(function(areaName){
            gulp.src('dist/dev/' + areaName + '/index.html')
                .pipe($.inject(gulp.src(bowerFiles, { read: false }), {
                    name: 'bower',
                    ignorePath: 'vendor/bower/',
                    addRootSlash: false,
                    transform: function(filepath) {
                        var newPath;
                        var cleanFilepath = filepath.replace(/^[/\\\\]?(?:.+[/\\\\]+?)?(.+?)[/\\\\]/, '');
                        var extension = cleanFilepath.split('.').pop();
                        if (extension == 'js') {
                            return '<script src="' + areaName + '/js/vendor/' + cleanFilepath + '"></script>';
                        } else if (extension == 'css') {
                            return '<link href="' + areaName + '/css/vendor/' + cleanFilepath + '" rel="stylesheet" type="text/css">'
                        }
                    }
                }))
            .pipe($.inject(gulp.src(fileDependencyOrder, { read: false, cwd: 'dist/dev/' + areaName }), { name: 'app', addRootSlash: false, addPrefix: areaName }))
            //UGH
            .pipe($.inject(gulp.src('js/app.init.js', { read: false, cwd: 'dist/dev/' + areaName }), { name: 'bootstrapper', addRootSlash: false, addPrefix: areaName  }))
            .pipe($.rename('index.html'))
            .pipe(gulp.dest(areaPath(areaName)));
    });
});

//
//
// SERVER
//
//

gulp.task('express', function() {
    var express = require('express');
    var app = express();

    app.engine('html', require('ejs').renderFile);
    app.set('views', __dirname + '/dist/dev/');
    
    app.use(express.static(__dirname + '/dist/dev/'));
    app.get('/forums/*', function (req,res) {
        res.render('forums/index.html');
        console.log('served forums index.html');
    });
    app.get('/announcements/*', function (req,res) {
        res.render('announcements/index.html');
        console.log('served announcements index.html');
    });
    app.get('/stories/*', function (req,res) {
        res.render('stories/index.html');
        console.log('served stories index.html');
    });
   
    app.listen(4200);
});

//
//
// WATCH
//
//

gulp.task('watch', function () {
	gulp.watch(sources.js, ['scripts']);
	gulp.watch(sources.partials, ['templates']);
    gulp.watch(sources.sass, ['stylesheets']);
});

//
//
// TASKS
//
//

gulp.task('default', ['dev', 'inject', 'watch', 'express']);

gulp.task('dev', ['index', 'scripts', 'templates', 'stylesheets', 'bower']);

gulp.task('deploy', ['dev', 'inject']);

gulp.task('prod', ['dev'], function(){
    //build prod from dev build
    var jsFilter = $.filter(['**/*.js', '*.js']);
   
    var appFiles = bowerFiles.concat(sources.dependencyJs, ['dist/dev/css/*.css'])
    return gulp.src(appFiles)
        .pipe(jsFilter)
        .pipe($.concat('app.min.js'))
        .pipe($.uglify())
        .pipe(gulp.dest(outputs.prod))
        .pipe(jsFilter.restore());
});
