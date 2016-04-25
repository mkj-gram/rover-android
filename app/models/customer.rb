class Customer
    include Mongoid::Document
    include Elasticsearch::Model

    field :account_id, type: Integer
    field :identifier, type: String
    field :name, type: String
    field :email, type: String
    field :age, type: Integer
    field :gender, type: String
    field :phone_number, type: String
    field :tags, type: Array
    field :traits, type: Hash
    field :location, type: GeoPoint
    field :inbox_updated_at, type: Time, default: -> { Time.zone.now }

    index({"account_id": 1, "devices._id": 1}, {unique: true, partial_filter_expression: {"devices._id" => {"$exists" => true}}})
    index({"account_id": 1, "identifier": 1},  {unique: true, partial_filter_expression: {"identifier" => {"$exists" => true}}})
    index({"account_id": 1, "traits": 1}, {partial_filter_expression: {"traits" => {"$exists" => true}}})
    index({"devices.token": 1}, {unique: true, partial_filter_expression: {"devices.token" => {"$exists" => true}}})
    embeds_many :devices, class_name: "CustomerDevice"

    def self.search_string_mapping
        {
            type: "string",
            index: "not_analyzed",
            fields: {
                reversed: {
                    type: "string",
                    analyzer: "reversed",
                    search_analyzer: "reversed",
                    store: "no"
                },
                ngrams: {
                    type: "string",
                    analyzer: "substring",
                    search_analyzer: "simple",
                    store: "no"
                }
            }
        }
    end

    settings index: ElasticsearchShardCountHelper.get_settings({number_of_shards: 3, number_of_replicas: 1}).merge(
        {
            analysis:  {
                filter: {
                    substring_filter: {
                        type: "ngram",
                        min_gram: 1,
                        max_gram: 10,
                        token_chars: ["letter", "digit"]
                    }
                },
                analyzer: {
                    substring: {
                        type: "custom",
                        tokenizer: "whitespace",
                        filter: [
                            "lowercase",
                            "substring_filter"
                        ]
                    },
                    reversed: {
                        type: "custom",
                        tokenizer: "keyword",
                        filter: [
                            "lowercase",
                            "reverse"
                        ]
                    }
                }
            }
        }

    ) do
        mapping do
            indexes :account_id, type: 'integer', index: 'not_analyzed'
            indexes :identifier, type: 'string', index: 'not_analyzed'
            indexes :name, Customer.search_string_mapping
            indexes :email, Customer.search_string_mapping
            indexes :phone_number, Customer.search_string_mapping
            indexes :age, type: 'integer'
            indexes :gender, type: 'string', index: 'not_analyzed'
            indexes :tags, type: 'string', index: 'not_analyzed'
            indexes :created_at, type: 'date', index: 'not_analyzed'
            indexes :traits, type: 'object'
            indexes :location, type: "geo_point", lat_lon: true
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
                indexes :development, type: 'boolean', index: 'not_analyzed'
            end
        end
    end

    validates :account_id, presence: true
    validates :email, email: { allow_blank: true }
    # where should we store counter cache? how do we?
    # # belongs_to :account, counter_cache: true

    after_destroy do
        begin
            __elasticsearch__.delete_document
        rescue Elasticsearch::Transport::Transport::Errors::NotFound => e
            Rails.logger.warn(e)
        end
    end

    before_save :update_active_traits
    after_create :increment_customers_count, if: -> { indexable_customer? }
    after_destroy :decrement_customers_count

    after_save :index_customer

    def as_indexed_json(options = {})

        json = {
            account_id: self.account_id,
            identifier: self.identifier,
            name: self.name,
            email: self.email,
            phone_number: self.phone_number,
            tags: self.tags,
            traits: self.traits,
            age: self.age,
            gender: self.gender,
            location: location_as_indexed_json,
            devices: devices_as_indexed_json(options)
        }
        Rails.logger.debug("indexing document #{json}")
        return json
    end



    def self.get_index_name(arg)
        account_id = arg.is_a?(Fixnum) ? arg : (arg.is_a?(Customer) ? arg.account_id : arg.id)
        return "customers_account_#{account_id}"
    end

    def self.create_index!(opts = {})
        client = Customer.__elasticsearch__.client
        settings = Customer.settings.to_hash.merge(BeaconConfigurationVisit.settings.to_hash)
        mappings = Customer.mappings.to_hash.merge(BeaconConfigurationVisit.mappings.to_hash)
        dynamic_templates = [
            {
                strings: {
                    match_mapping_type: "string",
                    mapping: Customer.search_string_mapping
                }
            }
        ]

        mappings[:customer][:dynamic_templates] = dynamic_templates

        force = opts.delete(:force)
        if force && client.indices.exists?(index: Customer.index_name)
            client.indices.delete(index: Customer.index_name)
        end

        client.indices.create(index: Customer.index_name, body: {
                                settings: settings.to_hash,
                                mappings: mappings.to_hash
        })

    end

    def self.create_alias!(account)
        client = Customer.__elasticsearch__.client
        client.indices.put_alias(
            index: Customer.index_name,
            name: Customer.get_index_name(account),
            body: {
                filter: {
                    term: {
                        account_id: account.id
                    }
                }
            }
        )
    end

    def message_attributes
        {
            "name" => name,
            "email" => email,
            "phone-number" => phone_number,
            "age" => age,
            "gender" => gender,
            "traits" => traits
        }
    end

    def indexable_customer?
        (!self.identifier.nil?) || (self.identifier.nil? && devices.any?)
    end

    def inbox
        @inbox ||= CustomerInbox.new(self)
    end

    def gender=(val)
        # make sure gender is always in the form of male or female
        if val == "male" || val == "female"
            self[:gender] = val
        else
            self[:gender] = nil
        end
    end

    def location_as_indexed_json
        if self.location
            {lat: self.location.lat, lon: self.location.lng}
        else
            nil
        end
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

    def create_inbox
        CustomerInbox.create(customer_id: self.id)
    end

    def update_active_traits
        if changes.include?(:traits)
            # old {gold_member => false}
            # new {gold_member => true}
            # we want {gold_member => true}
            # to map to {key: gold_member, type: Boolean }
            previous_trait_keys = traits_was.nil? ? [] : traits_was.keys
            trait_keys = traits.nil? ? [] : traits.keys

            old_trait_keys = previous_trait_keys - trait_keys
            new_trait_keys = trait_keys - previous_trait_keys

            new_traits = new_trait_keys.map{|key| CustomerTrait.new(trait_key: key, value: traits[key])}
            CustomerActiveTraits.update_traits(self.account_id, old_trait_keys, new_traits)
        end
    end

    def devices_as_indexed_json(options = {})
        self.devices.map{|device| device.as_indexed_json(options)}
    end

    def increment_customers_count
        Account.update_counters(account_id, customers_count: 1)
    end

    def decrement_customers_count
        Account.update_counters(account_id, customers_count: -1)
    end

    def index_customer
        # we only want to show customers which are identified or have a device
        return if changes.empty?
        # going from no identifier to named
        if identifier.nil? && changes.include?(:devices) && devices_was.any? && devices.empty?
            puts "this anonymous user doesn't have a device anymore"
            decrement_customers_count
            begin
                self.delete_elasticsearch_document
            rescue Elasticsearch::Transport::Transport::Errors::NotFound => e
                Rails.logger.warn(e)
            end
        elsif identifier.nil? && devices.any?
            self.index_elasticsearch_document
        elsif !identifier.nil?
            self.index_elasticsearch_document
        end
    end

    def index_elasticsearch_document(opts = {})
        client = __elasticsearch__.client
        document = self.as_indexed_json

        client.index(
            {
                index: Customer.get_index_name(self),
                type:  Customer.document_type,
                id:    self.id.to_s,
                body:  document
            }.merge(opts)
        )
    end

    def update_elasticsearch_document(opts = {})
        self.index_document(opts)
        Rails.logger.warn("Not implemented")
    end

    def delete_elasticsearch_document
        client = __elasticsearch__.client
        client.delete(
            {
                index: Customer.get_index_name(self),
                type: Customer.document_type,
                id: self.id.to_s
            }
        )

    end

end
