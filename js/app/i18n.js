/*global _, Gettext */

(function($, _, Gettext) {
    var i18n = function() {
        var gt = this.gt = new Gettext();

        this._ = function(msgid, msgctx) {
            return gt.pgettext(msgctx || null, msgid);
        };
    };

    _.extend(i18n.prototype, {
        languages: {
            en_US : 'English',
            tr    : 'Türkçe'
        },

        defaultLang: 'en_US',

        init: function() {
            this._createLangMenu();

            var language = localStorage.getItem('language') || this.defaultLang;

            this.gt.try_load_lang_po('locales/%s/messages.po'.replace('%s', language));

            $('.js-lang-switcher-title').text(this.languages[language]);

            $('[data-trans]').translate();
            $('[placeholder]').translateAttr('placeholder');
            $('input[type="button"], input[type="submit"], input[type="reset"]').translateAttr('value');
        },

        _createLangMenu: function() {
            var ct  = $('#js-lang-switcher ul'),
                tpl = _.template('<li><a data-lang="<%= code %>"><%= title %></a></li>');

            _.each(this.languages, function(value, key) {
                ct.append(tpl({title: value, code: key}));
            });
        },

        changeLang: function(lang) {
            if (!_.contains(_.keys(this.languages), lang)) {
                return;
            }

            localStorage.setItem('language', lang);

            window.location.reload();
        }
    });

    Usergrid.i18n = new i18n();

    $.fn.translate = function() {
        return this.each(function() {
            var el = $(this),
                transData = el.data('trans'),
                msg = {
                    message : null,
                    plural  : null,
                    context : null
                };

            if (_.isString(transData)) {
                msg.message = transData || el.html();
            } else if ($.isPlainObject(transData)) {
                msg = _.extend(msg, _.pick(transData, 'message', 'plural', 'context'));

                if (!msg.message) {
                    msg.message = el.html();
                }
            } else {
                msg.message = el.html();
            }

            if (!msg.message) {
                return;
            }

            el.html(Usergrid.i18n._(msg.message, msg.context));
        });
    };

    $.fn.translateAttr = function(attr) {
        return this.each(function() {
            var el  = $(this),
                msg = el.attr(attr);

            if (msg) {
                el.attr(attr, Usergrid.i18n._(msg));
            }
        });
    };


    $(function() {
        Usergrid.i18n.init();

        $('#js-lang-switcher').on('click', '[data-lang]', function(e) {
            e.preventDefault();

            Usergrid.i18n.changeLang($(this).data('lang'));
        });
    });
})(jQuery, _, Gettext);

