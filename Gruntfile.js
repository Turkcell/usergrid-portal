module.exports = function(grunt) {
    var ignoredFilesRegex = new RegExp([
        'js/spec',
        'js/unit-tests',
        'node_modules',
        'sass',
        'templates/test',
        'test',
        'Gruntfile.js',
        'LICENSE',
        'package.json',
        'README',
        'Vagrantfile'
    ].join('|'));

    grunt.initConfig({
        clean: {
            dist: ['dist']
        },
        copy: {
            dist: {
                files: [
                    {src: ['**'], dest: 'dist/', expand: true, filter: function(filepath) {
                        return !filepath.match(ignoredFilesRegex);
                    }}
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['clean', 'copy']);
};