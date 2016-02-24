module.exports = function (grunt) {

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      main: {
        files: {
          './temp/angular-ui-chat.browserify.js': ['./angular-ui-chat.js']
        },
        options: {
          browserifyOptions: {
           debug: false,
           extensions: ['.js']
          }
        }
      }
    },
    uglify: {
      main: {
        src: './temp/angular-ui-chat.browserify.js',
        dest:'./dist/angular-ui-chat.min.js'
      }
    },
    less: {
      main: {
        options: {
          sourceMap: false
        },
        files: {
          "./temp/ui-chat.css": "./styles/ui-chat.less"
        }
      }
    },
    cssmin: {
      main: {
        src:['./temp/ui-chat.css', './styles/twemoji-awesome.css'],
        dest:'./dist/angular-ui-chat.min.css'
      }
    },
    clean: {
      main:{
        src:['dist','temp']
      }
    },
    watch: {
      scripts: {
        files: 'angular-ui-chat.js',
        tasks: ['browserify','uglify'],
        options: {
          interrupt: true,
        },
      },
      css: {
        files: 'styles/ui-chat.less',
        tasks: ['less','cssmin'],
        options: {
          interrupt: true,
        },
      },
    },
  });
  grunt.registerTask('dist', ['clean', 'browserify','less','cssmin', 'uglify']);
  grunt.registerTask('dev', ['clean', 'browserify','less','cssmin','uglify', 'watch']);
};
