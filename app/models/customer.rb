class Customer
    include Elasticsearch::Model
    include ActiveModel::Validations
    include Virtus.model(:nullify_blank => true)
    include VirtusDirtyAttributes
    extend ActiveModel::Naming
    extend ActiveModel::Callbacks

    attribute :_id, BSON::ObjectId, default: lambda { |model, attribute| BSON::ObjectId.new }
    attribute :account_id, Integer
    attribute :identifier, String
    attribute :first_name, String
    attribute :last_name, String
    attribute :email, String
    attribute :age, Integer
    attribute :gender, String
    attribute :phone_number, String
    attribute :tags, Array
    attribute :traits, Hash
    attribute :location, GeoPoint
    attribute :inbox_updated_at, Time, default: lambda { |model, attribute| Time.zone.now }
    attribute :devices, Array[CustomerDevice], default: []

    define_model_callbacks :save, :create, :update, :destroy

    alias_method :id, :_id
    # track_dirty_attributes :a
    # index({"account_id": 1, "devices._id": 1}, {unique: true, partial_filter_expression: {"devices._id" => {"$exists" => true}}})
    # index({"account_id": 1, "identifier": 1},  {unique: true, partial_filter_expression: {"identifier" => {"$exists" => true}}})
    # index({"account_id": 1, "traits": 1}, {partial_filter_expression: {"traits" => {"$exists" => true}}})
    # index({"devices.token": 1}, {unique: true, partial_filter_expression: {"devices.token" => {"$exists" => true}}})
    # embeds_many :devices, class_name: "CustomerDevice"

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
            indexes :first_name, Customer.search_string_mapping
            indexes :last_name, Customer.search_string_mapping
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

    validates :_id, presence: true
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
            first_name: self.first_name,
            last_name: self.last_name,
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

    def to_doc
        current_attributes = attributes
        # work around since virtus doesn't do nested attributes
        current_attributes[:devices] = current_attributes[:devices].map(&:to_doc) if current_attributes[:devices]
        return current_attributes
    end

    def self.collection_name
        'customers'.freeze
    end

    def collection_name
        Customer.collection_name
    end

    def self.mongo_client
        $mongo
    end

    def mongo_client
        Customer.mongo_client
    end

    def inspect
        "#<Customer:#{object_id} _id=#{@_id} first_name=#{format_variable(@first_name)} last_name=#{format_variable(@last_name)} email=#{format_variable(@email)} phone_number=#{format_variable(@phone_number)} age=#{format_variable(@age)} devices=#{format_variable(@devices)}>"
    end

    def valid?
        if devices.any?
            super && devices.all?(&:valid?)
        else
            super
        end
    end

    def self.from_document(doc)
        customer = Customer.new(doc.merge(new_record: false))
        customer.devices.each { |device| device.customer = customer } if customer.devices.any?
        return customer
    end

    def self.find(id)
        doc = mongo_client[collection_name].find("_id" => BSON::ObjectId(id)).limit(1).first
        return nil if doc.nil?
        return Customer.from_document(doc)
    end

    def self.first
        doc = mongo_client[collection_name].find().limit(1).first
        return nil if doc.nil?
        return Customer.from_document(doc)
    end

    def self.find_all(ids)
        ids = ids.map{|id| BSON::ObjectId(id)}
        docs = mongo_client[collection_name].find("_id" => {"$in" => ids }).map{|document| Customer.from_document(document) }
        return docs
    end

    def self.find_by(query)
        doc = mongo_client[collection_name].find(query).first
        return nil if doc.nil?
        return Customer.from_document(doc)
    end

    def self.delete_all
        mongo_client[collection_name].find().delete_many
    end

    def build_device(attributes)
        CustomerDevice.new(attributes.merge(customer: self))
    end

    def create
        return false if !valid?
        run_callbacks :create do
            run_callbacks :save do
                mongo_client[collection_name].insert_one(to_doc)
            end
        end
        changes_applied
    end

    def save
        return false if !valid?
        if new_record?
            create
        else
            run_callbacks :save do
                # grab the changes
                if changes.any?
                    mongo_client[collection_name].find("_id" => self._id).update_one(
                        changes.map do |k,v|
                            new_value = v.last
                            if new_value.is_a?(Array) && new_value.first.respond_to?(:to_doc)
                                new_value = new_value.map(&:to_doc)
                            end
                            {"$set" => { k => new_value } }
                        end
                    )
                end
            end
            changes_applied
        end
    end

    def remove_device(device)
        devices.delete_if{|stored_device| stored_device._id == device._id}
        run_callbacks :save do
            mongo_client[collection_name].find({"_id" => self._id}).update_one({"$pull" => {"devices" => {"_id" => device._id}}})
        end
        changes_applied
        return true
    end

    def add_device(device)
        return false if !device.valid?
        return true if devices.one?{ |stored_device| stored_device._id == device._id }
        devices << device
        run_callbacks :save do
            mongo_client[collection_name].find({"_id" => self._id}).update_one({"$push" => {"devices" => device.to_doc}})
        end
        changes_applied
        return true
    end

    def destroy
        return if new_record?
        mongo_client[collection_name].delete_one("_id" => self._id)
    end

    def message_attributes
        {
            "identifier" => identifier,
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

    def gender=(new_gender)
        custom_gender = nil
        if new_gender == "male" || new_gender == "female"
            custom_gender = new_gender
        end
        super custom_gender
    end

    def name
        format("%s %s", first_name, last_name)
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

    def format_variable(value)
        value.nil? ? "nil" : value
    end

    def persist
        # mongo_client[collection_name].
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
        if identifier.nil? && changes.include?(:devices) && changes[:devices].first.any? && changes[:devices].last.empty?
            Rails.logger.info("#{self._id}: this anonymous user doesn't have a device anymore")
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
        Rails.logger.info("Indexing #{self._id} from Elasticsearch".green.bold)
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
        Rails.logger.info("Deleting #{self._id} from Elasticsearch".green.bold)
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
