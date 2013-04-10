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

    grunt.registerMultiTask('i18n-extract', 'Extracts translatable strings from HTML files', function() {
        var $        = require('cheerio'),
            done     = this.async(),
            _        = grunt.util._,
            messages = [],
            options  = this.options({
                template : 'locales/default.pot.swig',
                output   : 'locales/default.pot'
            });

        function addToMessages(msg) {
            var msgInStrings = _.find(messages, function(message) {
                return message.message === msg.message;
            });

            if (!msgInStrings) {
                messages.push(msg);

                return true;
            }

            return false;
        }

        grunt.util.async.map(this.filesSrc, function(filepath, callback) {
            grunt.verbose.subhead(filepath);

            var html                  = grunt.file.read(filepath),
                translatableNodes     = $('[data-trans]', html),
                nodesWithPlaceholder  = $('[placeholder]', html),
                buttonNodes           = $('input[type="submit"], input[type="reset"], input[type="button"]', html),
                fileStringCount       = 0,
                msgObject = {
                    message   : null,
                    plural    : null,
                    context   : null,
                    _file     : filepath,
                    _fragment : null
                };

            if (translatableNodes.length === 0 && nodesWithPlaceholder.length === 0 && buttonNodes.length === 0) {
                grunt.verbose.writeln('No strings found'.red);

                return;
            }

            translatableNodes.each(function() {
                var el = $(this),
                    transInfo = el.attr('data-trans'),
                    msg = _.extend({}, msgObject, {
                        _fragment : this.toString()
                    });

                try {
                    transInfo = JSON.parse(transInfo);
                } catch (e) {}

                if (_.isString(transInfo)) {
                    msg.message = transInfo || el.html();
                } else if (_.isPlainObject(transInfo)) {
                    msg = _.extend(msg, _.pick(transInfo, 'message', 'plural', 'context'));

                    if (!msg.message) {
                        msg.message = el.html();
                    }
                } else {
                    msg.message = el.html();
                }

                if (!msg.message) {
                    return;
                }

                if (addToMessages(msg)) {
                    fileStringCount++;

                    grunt.verbose.debug(msg.message);
                }
            });

            function handleAttrText(attr, node) {
                var message = $(node).attr(attr);

                if (!message) {
                    return;
                }

                var msg = _.extend({}, msgObject, {
                    message   : message,
                    _fragment : node.toString()
                });

                if (addToMessages(msg)) {
                    fileStringCount++;

                    grunt.verbose.debug(msg.message);
                }
            }

            nodesWithPlaceholder.each(function() {
                handleAttrText('placeholder', this);
            });

            buttonNodes.each(function() {
                handleAttrText('value', this);
            });


            var coloredCount = fileStringCount === 0 ? fileStringCount.toString().red : fileStringCount.toString().green;

            grunt.verbose.writeln(grunt.util.pluralize(fileStringCount, 'Found %s unique string/Found %s unique strings'), coloredCount);

            callback(null);
        }, function(error, message) {
            if (error) {
                grunt.log.error('%s, %s', error, message);
            } else {
                grunt.log.writeln('Found %s total unique strings', messages.length.toString().cyan);

                var swig = require('swig'),
                    tpl  = swig.compile(grunt.file.read(options.template), {filename: options.template});

                grunt.file.write(options.output, tpl({
                    messages: messages,
                    revision_date: new Date()
                }));
            }

            done(!error);
        });
    });
};