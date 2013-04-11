# Contributing to Usergrid Portal

## Building Development Environment
[Vagrant] is used to build a uniformed development environment between developers. It starts a virtual machine with minimum hardware requirements and provision with [Puppet]. This shortens the list of procedures to build our development environment.

### Installation
* Install [VirtualBox]
* Configure Host-Only Network

![08-03-2013 11-23-11](https://f.cloud.github.com/assets/158772/235995/0afaba56-87d3-11e2-9cfb-0d3156ebcdfd.gif)

* Install [Vagrant]
* Install [vagrant-hostmaster](https://github.com/mosaicxm/vagrant-hostmaster)
* Lauch your vagrant virtual machine

```bash
vagrant up
vagrant ssh
```

* Install node modules

```bash
cd /vagrant
npm install
```
* Open https://usergrid.dev in your browser.

## Starting to Code

### Stylesheets
We use [compass] to author stylesheets. If you want to make changes in *.scss files visible immediately:

```bash
cd /vagrant/sass    # not project root!
compass watch
```

### Tasks
[Grunt] helps us to automate things. Currently we use it just for building a distribution version of the portal. More task will be added.

#### Deployment Distribution
When you run `grunt` command, it will only copy the needed files to `dist` folder for deployment. All development related resources stripped out. *This is the default task in the project grunt configuration*.


[Compass]: http://compass-style.org/
[Grunt]: http://gruntjs.com/
[VirtualBox]: https://www.virtualbox.org/
[Vagrant]: http://www.vagrantup.com/
[Puppet]: https://puppetlabs.com/
[vagrant-hostmaster]: https://github.com/mosaicxm/vagrant-hostmaster
