var gulp = require('gulp');
var del = require('del');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var source = require('vinyl-source-stream');

var _ = require('underscore');
var gulpLoadPlugins = require('gulp-load-plugins');
var $ = gulpLoadPlugins({
    scope: ['devDependencies']
});

var browserify = require('browserify');
var eventstream = require('event-stream');


require('events').EventEmitter.prototype._maxListeners = 100;

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
};

var jsAppFileName = 'community.app.js';

var sources = {
    index: 'app/index.html',
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
// BUILD HELPERS
//
//


function areaBuilder(taskFn){
    var areas = ['announcements', 'directory', 'features', 'stories', 'forums'];

    _.each(areas, function(areaName){
        taskFn(areaName);
    });
}

function areaPath(areaName, prodBuild) {
    var outputPath = './dist/build/'
    return outputPath + areaName;
}

gulp.task('clean', function(){
    del([ './dist/', './app/design/community.css' ]);
});


//
//
// INDEX TASKS
//
//


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
gulp.task('scripts', function() {
    browserifyHelper();
});

gulp.task('prod-scripts', function(){
    browserifyHelper(true);
});

function browserifyHelper(prodBuild) {
    areaBuilder(function(areaName){
        var b = browserify({ 
            debug: true,
            paths: ['app/', 'vendor/bower/', 'node_modules', 'app/shared/', 'app/areas/'],
            fullPaths: true,
            cache: {},
            packageCache: {}
        });

        if (!prodBuild) {
            b = watchify(b);
            b.on('update', function(changedFilename){
                bundleHelper(false, b, areaName);
            });        
        }
        b.add('app/areas/' + areaName + '/init.js');
        bundleHelper(prodBuild, b, areaName);
    });
}

function bundleHelper(prodBuild, b, areaName){
    
    if (areaName) {
        return bundle(areaName);
    } else {
        areaBuilder(function(areaName) {
            return bundle(areaName);
        })
    }

    function bundle(areaName) {
        var bundleBlob = b.bundle()
            .on('error', function(err) {
                return $.notify().write(err);
            })
            .pipe(source(jsAppFileName))
            .pipe(buffer());

        if (!prodBuild) { 
            bundleBlob = bundleBlob
                .pipe($.sourcemaps.init({ loadMaps: true }))
                .pipe($.sourcemaps.write('./maps'))
        } else {
            bundleBlob = bundleBlob
                .pipe($.uglify());
        }
        
        bundleBlob
            .pipe(gulp.dest(areaPath(areaName, prodBuild) + '/js/'))
    }
}

/**** 
        TEMPLATE TASKS 
                        *****/

gulp.task('templates', function() {
    templateHelper();
});

gulp.task('prod-templates', function(){
    templateHelper(true);
});

function templateHelper(prodBuild) {
     areaBuilder(function(areaName){
         var templateBlob =  buildTemplates(areaName);
         if (prodBuild) {
            templateBlob = templateBlob
                .pipe($.uglify());
         }
        
        return templateBlob.pipe(gulp.dest(areaPath(areaName) + '/js/'));
    });
}

function buildTemplates(areaName) {
      return eventstream.merge(getSharedTemplates(), getAreaTemplates(areaName))
            .pipe($.concat('community.templates.js'))
}


function getSharedTemplates(){
      return gulp.src(['app/shared/**/*.html', '!app/index.html'])
            .pipe($.ngHtml2js({ moduleName: "community.templates" }));
}

function getAreaTemplates(areaName) {
     return gulp.src(['app/areas/' + areaName + '/**/*.html', '!app/index.html'])
            .pipe($.ngHtml2js({ moduleName: "community.templates", prefix: areaName + '/' }))
}

/***** 
        STYLE TASKS 
                        ******/
gulp.task('compile-stylesheets', function(){
    return gulp.src(sources.sass)
        .pipe($.compass({
           css: 'app/design',
           sass: 'assets/sass'
    }))
});

function stylesheetHelper(prodBuild) {
     areaBuilder(function(areaName){
        var blob = gulp.src('app/design/*.css');

        if (!prodBuild) {
            blob = blob
            .pipe(buffer())
            .pipe($.sourcemaps.init({ loadMaps: true }))
            .pipe($.sourcemaps.write('./maps'))
        }

        return blob.pipe(gulp.dest(areaPath(areaName) + '/css'));
    });
}

gulp.task('stylesheets', ['compile-stylesheets'], function(){
    stylesheetHelper();
});

gulp.task('prod-stylesheets', ['compile-stylesheets'], function(){
   stylesheetHelper(true);
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
    app.set('views', __dirname + '/dist/build/');
    
    app.use(express.static(__dirname + '/dist/build/'));
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

    app.get('/directory/*', function (req,res) {
        res.render('directory/index.html');
        console.log('served directory index.html');
    });

    app.get('/features/*', function (req,res) {
        res.render('features/index.html');
        console.log('served feature requests index.html');
    });

     app.get('/*', function (req,res) {
        res.render('directory/index.html');
        console.log('served directory index.html');
    });
   
    app.listen(4200);
});

//
//
// WATCH
//
//

gulp.task('watch', function () {
	gulp.watch(sources.partials, ['templates']);
    gulp.watch(sources.sass, ['stylesheets']);
});

//
//
// TASKS
//
//

gulp.task('default', ['dev', 'watch', 'express']);

gulp.task('dev-prod', ['prod', 'watch', 'express']);

gulp.task('deploy', ['prod']);

gulp.task('dev', ['index', 'scripts', 'templates', 'stylesheets']);

gulp.task('prod', ['index', 'prod-scripts', 'prod-templates', 'prod-stylesheets']);



