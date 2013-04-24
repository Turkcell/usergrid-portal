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
        },
        'i18n-extract': {
            main: {
                files: [
                    {src: ['index.html', 'templates/*.html'], filter: 'isFile', parser: 'html'},
                    {src: ['js/app/**/*.js'], filter: 'isFile', parser: 'js'}
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['clean', 'copy']);

    grunt.registerMultiTask('i18n-extract', 'Extracts translatable strings from HTML files', function() {
        var done = this.async();
        var options  = this.options({
            template : 'locales/default.pot.swig',
            output   : 'locales/default.pot'
        });
        var _ = grunt.util._;
        var $ = require('cheerio');
        var falafel = require('falafel');
        var files   = [];

        this.files.forEach(function(filePair) {
            filePair.src.forEach(function(filepath) {
                files.push({path: filepath, parser: filePair.parser});
            });
        });

        var Parser = function() {
            this.messages = {};
            this.msgObj = {
                message   : null,
                plural    : null,
                context   : null,
                _file     : [],
                _fragment : []
            };
        };

        _.extend(Parser.prototype, {
            addMessage: function(msg) {
                msg.message = _.trim(msg.message);

                if (_.has(this.messages, msg.message)) {
                    this.messages[msg.message]._file = _.union(this.messages[msg.message]._file, msg._file);
                    this.messages[msg.message]._fragment = _.union(this.messages[msg.message]._fragment, msg._fragment);
                } else {
                    this.messages[msg.message] = msg;
                }
            },

            parse: function(file) {
                var content = grunt.file.read(file.path);
                var messages = [];

                grunt.verbose.subhead(file.path);

                if (file.parser === 'js') {
                    messages = this.parseJs(content, file.path);
                } else if (file.parser === 'html') {
                    messages = this.parseHtml(content, file.path);
                }

                messages.forEach(function(msg) {
                    this.addMessage(msg);
                }, this);

                var messageCount = messages.length;

                grunt.verbose.writeln('String count: %s', messageCount === 0 ? messageCount.toString().red : messageCount.toString().green);
            },

            parseJs: function(content, filepath) {
                var messages  = [],
                    msgObject = _.extend({}, this.msgObj, {
                        _file: [filepath]
                    });

                falafel(content, function(node) {
                    if (node.type !== 'CallExpression') {
                        return;
                    }

                    var message = null;

                    if (node.callee.name === '__' || node.callee.name === '_f') {
                        message = node.arguments[0].value;
                    }

                    if (!message) {
                        return;
                    }

                    var msg = _.extend({}, msgObject, {
                        message: message
                    });

                    grunt.verbose.debug(msg.message);

                    messages.push(msg);
                });

                return messages;
            },

            parseHtml: function(content, filepath) {
                var messages  = [],
                    msgObject = _.extend({}, this.msgObj, {
                        _file: [filepath]
                    });

                var translatableNodes     = $('[data-trans]', content),
                    nodesWithPlaceholder  = $('[placeholder]', content),
                    buttonNodes           = $('input[type="submit"], input[type="reset"], input[type="button"]', content);

                translatableNodes.each(function() {
                    var el = $(this);
                    var transInfo = el.attr('data-trans');
                    var msg = _.extend({}, msgObject, {
                        _fragment: [this.toString()]
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

                    grunt.verbose.debug(msg.message);

                    messages.push(msg);
                });

                var handleAttrText = function(attr, node) {
                    var message = $(node).attr(attr);

                    if (!message) {
                        return;
                    }

                    var msg = _.extend({}, msgObject, {
                        message: message,
                        _fragment: [node.toString()]
                    });

                    grunt.verbose.debug(msg.message);

                    messages.push(msg);
                };

                nodesWithPlaceholder.each(function() {
                    handleAttrText('placeholder', this);
                });

                buttonNodes.each(function() {
                    handleAttrText('value', this);
                });

                return messages;
            }
        });

        var parser = new Parser();

        grunt.util.async.map(files, function(file, callback) {
            parser.parse(file);

            callback(null);
        }, function(error, message) {
            if (error) {
                grunt.log.error('%s, %s', error, message);
            } else {
                grunt.log.writeln('Found %s total unique strings', _.size(parser.messages).toString().cyan);

                var swig = require('swig');

                swig.init({ filters: {
                    trim: function(input) {
                        return _.trim(input.toString());
                    }
                }});

                var tpl = swig.compile(grunt.file.read(options.template), {filename: options.template});

                grunt.file.write(options.output, tpl({
                    messages: parser.messages,
                    revision_date: new Date()
                }));
            }

            done(!error);
        });
    });
};