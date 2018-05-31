Pod::Spec.new do |s|
  s.name              = 'RoverFoundation'
  s.version           = '2.0.0'
  s.summary           = 'iOS framework for the Rover platform'
  s.homepage          = 'https://www.rover.io'
  s.license           = 'Apache License, Version 2.0'
  s.author            = { 'Rover Labs Inc.' => 'support@rover.io' }
  s.platform          = :ios, '10.0'
  s.source            = { :git => 'https://github.com/RoverPlatform/rover-ios.git', :tag => 'v#{s.version}' }
  s.source_files      = 'Sources/Foundation/**/*'
  s.swift_version     = '4.1'
  s.cocoapods_version = '>= 1.4.0'
end
