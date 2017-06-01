# coding: utf-8
lib = File.expand_path('../', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)

Gem::Specification.new do |spec|
  spec.name          = "rover-apis"
  spec.version       = "0.0.1"
  spec.authors       = ["Rover Labs Inc"]
  spec.email         = ["dev@rover.io"]

  spec.summary       = %q{gRPC generated APIs}
  spec.description   = %q{gRPC generated APIs}
  spec.homepage      = "https://github.com/RoverPlatform/rover/apis"
  spec.license       = "MIT"

  # Prevent pushing this gem to RubyGems.org. To allow pushes either set the 'allowed_push_host'
  # to allow pushing to a single host or delete this section to allow pushing to any host.
  if spec.respond_to?(:metadata)
    spec.metadata['allowed_push_host'] = "https://github.com'"
  else
    raise "RubyGems 2.0 or newer is required to protect against " \
      "public gem pushes."
  end

  spec.files         = Dir['./**/*.rb'].reject do |f|
    f.match(%r{^(test|spec|features)/})
  end
  spec.bindir        = "exe"
  spec.executables   = spec.files.grep(%r{^exe/}) { |f| File.basename(f) }
  spec.require_paths = ["./"]

  spec.add_development_dependency "bundler", "~> 1.14"

  spec.add_runtime_dependency 'grpc', '~> 1.2'
end
