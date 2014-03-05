
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    copy: {
      dist: {
        files: [ 
          {
            expand: true,
            cwd: 'bower_components/weibo-keywords',
            src: ['sina-keywords.conf', 'twitter-keywords.conf'],
            dest: 'config/'
          }
        ]
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-copy');
  // Default task.
  grunt.registerTask('default', ['copy']);

};
