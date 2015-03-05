module.exports =  {
  app: {
    options: {
      base: 'app/areas'
    },
    src: [ './app/areas/**/*.html', '!./app/**/index.html'],
    dest: './build/js/templates/app.js'
  },
  common: {
    options: {
      base: 'app/'
    },
    src: [ './app/shared/**/*.html' ],
    dest: './build/js/templates/common.js'
  }
}