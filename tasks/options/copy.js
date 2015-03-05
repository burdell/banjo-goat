module.exports =  {
    appjs: {
      files: [
          {
            src: [ '<%= app_files.js %>' ],
            dest: '<%= build_dir %>/js/',
            cwd: '.',
            expand: true
          }
        ]
      },
       build_app_assets: {
        files: [
          { 
            src: [ '**' ],
            dest: '<%= build_dir %>/assets/',
            cwd: 'src/assets',
            expand: true
          }
       ]   
      }
}