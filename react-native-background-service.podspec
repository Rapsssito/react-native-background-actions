require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|

  s.name         = package['name']
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  react-native-background-service
                   DESC
  s.homepage     = package['repository']['url']
  s.license      = "MIT"
  # s.license    = { :type => "MIT", :file => "FILE_LICENSE" }
  s.authors      = { "Rapsssito" => "contact@rodrigomartin.dev" }
  s.platforms    = { :ios => "9.0", :tvos => "10.0" }
  s.source       = { :git => s.homepage, :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,swift}"
  s.requires_arc = true

  s.dependency "React"
end
