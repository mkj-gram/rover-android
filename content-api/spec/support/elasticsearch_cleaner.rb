RSpec.configure do |config|

  INDEXED_MODELS = [ProximityMessageTemplate, Customer, BeaconConfiguration, Place].freeze

  config.before(:suite) do
    Elasticsearch::Model.client.indices.delete(name: "*", index: "*")
    INDEXED_MODELS.each { |klass| klass.create_index! }
  end
end
