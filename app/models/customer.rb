class Customer
    include Mongoid::Document
    include Elasticsearch::Model
    include Elasticsearch::Model::Callbacks

    field :account_id, type: Integer
    field :identifier, type: String
    field :name, type: String
    field :email, type: String
    field :phone_number, type: String
    field :tags, type: Array
    field :traits, type: Hash

    index({"devices._id": 1}, {unique: true, partial_filter_expression: {"devices._id" => {"$exists" => true}}})
    index({"account_id": 1, "identifier": 1},  {unique: true, partial_filter_expression: {"identifier" => {"$exists" => true}}})

    embeds_many :devices, class_name: "CustomerDevice"

    settings index: ElasticsearchShardCountHelper.get_settings({ number_of_shards: 2, number_of_replicas: 2 }) do
        mapping do
            indexes :account_id, type: 'long', index: 'not_analyzed'
            indexes :identifier, type: 'string', index: 'not_analyzed'
            indexes :name, type: 'string', index: 'not_analyzed'
            indexes :email, type: 'string', index: 'not_analyzed'
            indexes :phone_number, type: 'string', index: 'not_analyzed'
            indexes :tags, type: 'string', index: 'not_analyzed'
            indexes :created_at, type: 'date', index: 'not_analyzed'
            indexes :traits, type: 'object'
            indexes :devices, type: 'nested' do
                indexes :udid, type: 'string', index: 'no'
                indexes :token, type: 'string', index: 'no'
                indexes :locale_lang, type: 'string', index: 'not_analyzed'
                indexes :locale_region, type: 'string', index: 'not_analyzed'
                indexes :time_zone, type: 'string', index: 'not_analyzed'
                indexes :sdk_version, type: 'string', index: 'not_analyzed'
                indexes :platform, type: 'string', index: 'not_analyzed'
                indexes :os_name, type: 'string', index: 'not_analyzed'
                indexes :os_version, type: 'string', index: 'not_analyzed'
                indexes :model, type: 'string', index: 'not_analyzed'
                indexes :manufacturer, type: 'string', index: 'not_analyzed'
                indexes :carrier, type: 'string', index: 'not_analyzed'
                indexes :background_enabled, type: 'boolean', index: 'not_analyzed'
                indexes :local_notifications_enabled, type: 'boolean', index: 'not_analyzed'
                indexes :remote_notifications_enabled, type: 'boolean', index: 'not_analyzed'
                indexes :location_monitoring_enabled, type: 'boolean', index: 'not_analyzed'
                indexes :bluetooth_enabled, type: 'boolean', index: 'not_analyzed'
            end
        end
    end

    validates :account_id, presence: true

    # where should we store counter cache? how do we?
    # # belongs_to :account, counter_cache: true

    before_save :update_active_traits

    def as_indexed_json(options = {})
        {
            account_id: self.account_id,
            identifier: self.identifier,
            name: self.name,
            email: self.email,
            phone_number: self.phone_number,
            tags: self.tags,
            traits: self.traits,
            devices: devices_as_indexed_json(options)
        }
    end

    def self.create_index!(opts = {})
        client = Customer.__elasticsearch__.client
        settings = Customer.settings.to_hash.merge(BeaconConfigurationVisit.settings.to_hash)
        mappings = Customer.mappings.to_hash.merge(BeaconConfigurationVisit.mappings.to_hash)

        client.indices.create(index: Customer.index_name, body: {
                                settings: settings.to_hash,
                                mappings: mappings.to_hash
        })
    end
    # def update_attributes_async(new_attributes)
    #     merge(new_attributes)
    #     if needs_update?
    #         UpdateCustomerAttributesWorker.perform_async(self.id, new_attributes)
    #     end
    # end

    # def merge(new_attributes)
    #     new_traits = new_attributes.delete(:traits)
    #     new_tags = new_attributes.delete(:tags)

    #     new_attributes[:traits] = self.traits.merge!(new_traits) if new_traits && new_traits.any?
    #     new_attributes[:tags] = (self.tags + new_tags).uniq if new_tags && new_tags.any?

    #     new_attributes.each do |attribute, value|
    #         self[attribute] = value
    #     end
    # end

    # def merge_and_update_attributes(new_attributes)
    #     if new_attributes.any?
    #         merge(new_attributes)
    #         self.update_attributes(new_attributes)
    #     end
    # end

    # def reindex_devices
    #     self.__elasticsearch__.update_document_attributes({ devices: devices_as_indexed_json })
    # end

    # private

    def update_active_traits
        if changes.include?(:traits)
            # old {gold_member => false}
            # new {gold_member => true}
            # we want {gold_member => true}
            # to map to {key: gold_member, type: Boolean }
            previous_trait_keys = traits_was.nil? ? [] : traits_was.map{|k,v| k.to_s }
            trait_keys = traits.nil? ? [] : traits.map{|k,v| k.to_s}

            old_trait_keys = previous_trait_keys - trait_keys
            new_trait_keys = trait_keys - previous_trait_keys

            CustomerActiveTraits.update_traits(self.account_id, old_trait_keys, new_trait_keys)
        end
    end

    def devices_as_indexed_json(options = {})
        self.devices.map{|device| device.as_indexed_json(options)}
    end

    # def needs_update?
    #     changes.any?
    # end

end
