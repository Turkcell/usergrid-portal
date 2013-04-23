msgid ""
msgstr ""
"Project-Id-Version: Usergrid Portal\n"
"POT-Creation-Date: 2013-04-10 11:31+0200\n"
"PO-Revision-Date: {{ revision_date|date('Y-m-d H:iO') }}\n"
"MIME-Version: 1.0\n"
"Content-Type: text/plain; charset=UTF-8\n"
"Content-Transfer-Encoding: 8bit\n"
"X-Generator: Grunt i18n-extract Task\n"
"Plural-Forms: nplurals=2; plural=(n != 1);\n"
"Language: en_US\n"

{% macro print message -%}
    {{ message|raw|replace('"', '\"', 'g')|trim }}
{%- endmacro %}

{% for msg in messages -%}
#. FRAGMENT {{ msg._fragment|raw|replace("\n", '', 'g') }}
#: {{ msg._file }}
{% if msg.context -%}
msgctxt "{{ print(msg.context) }}"
{% endif -%}
msgid "{{ print(msg.message) }}"
{% if msg.plural -%}
msgid_plural "{{ print(msg.plural) }}"
msgstr[0] ""
msgstr[1] ""
{% else -%}
msgstr ""
{% endif %}
{% endfor -%}