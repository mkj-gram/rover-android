Pod::Spec.new do |s|
  s.name              = 'RoverLocation'
  s.version           = '2.0.0'
  s.summary           = 'Location monitoring and tracking'
  s.homepage          = 'https://www.rover.io'
  s.license           = 'Apache License, Version 2.0'
  s.author            = { 'Rover Labs Inc.' => 'support@rover.io' }
  s.platform          = :ios, '10.0'
  s.source            = { :git => 'https://github.com/RoverPlatform/rover-ios.git', :tag => 'v#{s.version}' }
  s.source_files      = 'Sources/Location/**/*'
  s.swift_version     = '4.1'
  s.cocoapods_version = '>= 1.4.0'

  s.dependency 'RoverFoundation', '~> 2.0.0'
end
