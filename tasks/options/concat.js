module.exports = {
  css: {
    src: [
      '<%= vendor_files.css %>',
      '<%= build_dir %>/css/*.css'
    ],
    dest: '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
  },
  js: {
    options: {
      
    },
    src: [ 
      '<%= vendor_files.js %>', 
      'module.prefix', 
      '<%= build_dir %>/js/app/*.js', 
      '<%= build_dir %>/js/app/**/*.js', 
      '<%= html2js.app.dest %>', 
      '<%= html2js.common.dest %>', 
      'module.suffix' 
    ],
    dest: '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js'
  }
}