/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
  build_dir: 'build',
  compile_dir: 'bin',

  
  app_files: {
    js: [ 'app/**/*.js' ],
    jsunit: [ 'src/**/*.spec.js' ],
    
    atpl: [ 'app/areas/**/*.html', '!app/areas/**/index.html' ],
    ctpl: [ 'app/common/**/*.html' ],

    html: [ 'src/index.html' ],
    sass: 'app/styles/main.scss'
  },

  /**
   * This is a collection of files used during testing only.
   */
  test_files: {
    js: [
    ]
  },

  vendor_files: {
    js: [
      'build/js/vendor/**/*.js'
    ],
    css: [
      'build/css/vendor/**/*.js'
    ],
    assets: [
    ]
  },
};