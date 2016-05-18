RSpec.configure do |config|

    INDEXED_MODELS = [ProximityMessageTemplate, Customer, BeaconConfiguration, Place].freeze

    config.around(:each) do |example|
        INDEXED_MODELS.each { |klass| klass.create_index! }
        example.run
        begin
            Elasticsearch::Model.client.indices.delete_alias(name: "*", index: "customer")
        rescue Elasticsearch::Transport::Transport::Errors::NotFound => e
        end
        INDEXED_MODELS.each { |klass| begin klass.__elasticsearch__.delete_index!; rescue => e; end }
    end

end
