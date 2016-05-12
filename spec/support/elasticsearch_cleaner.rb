RSpec.configure do |config|

    INDEXED_MODELS = [ProximityMessageTemplate, Customer, BeaconConfiguration, Location].freeze

    config.around(:each) do |example|
        INDEXED_MODELS.each { |klass| klass.create_index! }
        example.run
        INDEXED_MODELS.each { |klass| klass.__elasticsearch__.delete_index! }
        begin
            Elasticsearch::Model.client.indices.delete_alias(name: "*", index: "customer")
        rescue Elasticsearch::Transport::Transport::Errors::NotFound => e
        end
    end

end
