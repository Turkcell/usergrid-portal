package { 'compass':
    ensure => latest,
    provider => gem
}

package { 'bootstrap-sass':
    ensure => '2.0.0',
    provider => gem
}

include apt

apt::ppa { 'ppa:chris-lea/node.js': }
->
package { ['nodejs']:
    ensure => latest
}
->
package { 'grunt-cli':
    ensure => present,
    provider => npm
}