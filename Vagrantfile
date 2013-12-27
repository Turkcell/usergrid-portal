Vagrant.configure("2") do |config|
  puppet_dir = ".puppet"

  config.vm.box = "precise64"
  config.vm.box_url = "http://files.vagrantup.com/precise64.box"
  config.vm.network :forwarded_port, guest: 8000, host: 8000

  config.vm.provider :virtualbox do |vb|
    vb.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]
  end

  config.vm.provision :shell, :path => File.join(puppet_dir, "bootstrap.sh")

  config.vm.provision :puppet do |puppet|
      puppet.module_path = File.join(puppet_dir, "modules")
      puppet.manifests_path = File.join(puppet_dir, "manifests")
      puppet.manifest_file = "main.pp"

      puppet.options = [
        "--verbose",
        "--debug"
      ]
    end
end
