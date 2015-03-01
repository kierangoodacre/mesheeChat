module.exports = function(grunt) {

 grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    mocha_casperjs: {
      options: {
        timeout: 5000,
        color: false
      },
      files: {
        src: ['test/features/**/*.js']
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          captureFile: 'results.txt',
          quiet: false,
          clearRequireCache: false
        },
        src: ['test/spec/**/*.js']
      }
    },
    express: {
      server: {
        options: {
          script: './server.js',
          hostname: 'localhost',
          port: 3001
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-mocha-casperjs');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-express');

  grunt.registerTask('default', ['express', 'mocha_casperjs', 'mochaTest']);

};