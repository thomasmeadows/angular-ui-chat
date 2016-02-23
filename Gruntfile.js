module.exports = function (grunt) {

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      dist: {
        files: {
          './angular-ui-chat.min.js': ['./angular-ui-chat.js']
        },
        options: {
          browserifyOptions: {
           debug: false,
           extensions: ['.js']
          }
        }
      }
    }
  });
};
