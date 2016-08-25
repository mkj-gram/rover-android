class Customer
    include Elasticsearch::Model
    include ActiveModel::Validations
    include VirtusDirtyAttributes
    include Virtus.model(:nullify_blank => true)
    extend ActiveModel::Naming
    extend ActiveModel::Callbacks

    MAX_BUCKETS = 5


    attribute :_id, BSON::ObjectId, default: lambda { |model, attribute| BSON::ObjectId.new }
    attribute :account_id, Integer
    attribute :identifier, NullableString
    attribute :first_name, NullableString
    attribute :last_name, NullableString
    attribute :email, NullableString
    attribute :age, Integer
    attribute :gender, NullableString
    attribute :phone_number, NullableString
    attribute :tags, Array[NullableString]
    attribute :traits, Hash
    attribute :inbox_updated_at, Time, default: lambda { |model, attribute| Time.zone.now }
    attribute :document_bucket, Integer, default: lambda { |model, attribute|  1 + rand(MAX_BUCKETS) }
    attribute :devices, Array[CustomerDevice], default: []
    attribute :created_at, Time
    attribute :updated_at, Time

    define_model_callbacks :save, :create, :update, :destroy

    def id
        _id.to_s
    end

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
            indexes :document_bucket, type: 'integer'
            indexes :devices, type: 'nested' do
                indexes :locale_lang, type: 'string', index: 'not_analyzed'
                indexes :locale_region, type: 'string', index: 'not_analyzed'
                indexes :time_zone, type: 'string', index: 'not_analyzed'
                indexes :sdk_version, type: 'string', index: 'not_analyzed'
                indexes :app_identifier, type: 'string', index: 'not_analyzed'
                indexes :location, type: "geo_point", lat_lon: true
                indexes :platform, type: 'string', index: 'not_analyzed'
                indexes :os_name, type: 'string', index: 'not_analyzed'
                indexes :os_version, type: 'string', index: 'not_analyzed'
                indexes :model, type: 'string', index: 'not_analyzed'
                indexes :manufacturer, type: 'string', index: 'not_analyzed'
                indexes :carrier, type: 'string', index: 'not_analyzed'
                indexes :background_enabled, type: 'boolean', index: 'not_analyzed'
                indexes :notifications_enabled, type: 'boolean', index: 'not_analyzed'
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
           self.delete_elasticsearch_document
        rescue Elasticsearch::Transport::Transport::Errors::NotFound => e
            Rails.logger.warn(e)
        end
    end

    after_create :increment_customers_count, if: -> { indexable_customer? }
    after_destroy :decrement_customers_count

    after_save :index_customer

    def as_indexed_json(options = {})
        {
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
            document_bucket: self.document_bucket,
            devices: devices_as_indexed_json(options)
        }
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
                routing: "customers",
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
        current_attributes.delete_if{|k,v| v.nil? }
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

    # def inspect
    #     "#<Customer:#{object_id} _id=#{@_id} first_name=#{format_variable(@first_name)} last_name=#{format_variable(@last_name)} email=#{format_variable(@email)} phone_number=#{format_variable(@phone_number)} age=#{format_variable(@age)} devices=#{format_variable(@devices)}>"
    # end

    class << self
        def from_document(doc)
            doc["_id"] = BSON::ObjectId(doc["_id"]["$oid"]) if doc["_id"].is_a?(Hash) && doc["_id"].has_key?("$oid")
            devices = doc.delete(:devices)
            customer = Customer.new(doc.merge(new_record: false))
            devices = devices.map{ |device_doc| CustomerDevice.from_document(device_doc)}
            customer.devices = devices
            customer.devices.each { |device| device.customer = customer } if customer.devices.any?
            customer.changes_applied # force an update for what attributes are
            return customer
        end

        def find(id)
            doc = mongo_client[collection_name].find("_id" => BSON::ObjectId(id)).limit(1).first
            return nil if doc.nil?
            return Customer.from_document(doc)
        end

        def first
            doc = mongo_client[collection_name].find().limit(1).first
            return nil if doc.nil?
            return Customer.from_document(doc)
        end

        def find_all(ids)
            return [] if ids.empty?
            ids = ids.map{|id| BSON::ObjectId(id)}
            docs = mongo_client[collection_name].find("_id" => {"$in" => ids }).map{|document| Customer.from_document(document) }
            return docs
        end

        def find_all_by(query)
            docs = mongo_client[collection_name].find(query).map{|document| Customer.from_document(document)}
            return docs
        end

        def find_by(query)
            doc = mongo_client[collection_name].find(query).first
            return nil if doc.nil?
            return Customer.from_document(doc)
        end

        def update_all(ids, update_params)
            ids = ids.map{|id| BSON::ObjectId(id)}
            mongo_client[collection_name].find("_id" => {"$in" => ids }).update_many("$set" => update_params)
        end

        def count(query = {})
            return mongo_client[collection_name].find(query).count
        end

        def delete_all
            mongo_client[collection_name].find().delete_many
        end

        def all_in_batches(batch_size = 1000)
            Enumerator.new do |y|
                mongo_client[collection_name].find().batch_size(batch_size).each do |document|
                    y << Customer.from_document(document)
                end
            end
        end

        def import
            all_in_batches.each_slice(1000) do |customers|
                body = []
                customers.each do |customer|
                    body.push({ index: { _index: 'customers', _type: 'customer', _id: customer.id }})
                    body.push(customer.as_indexed_json)
                end
                Customer.__elasticsearch__.client.bulk(body: body)
                Rails.logger.info("imported #{customers.size} documents")
            end
        end
    end

    def tags=(new_tags)
        new_tags.delete_if { |tag|  tag.nil? || tag.is_a?(String) && tag.empty? }
        return if new_tags.empty?
        super new_tags
    end

    def valid?
        if devices.any?
            super && devices.all?(&:valid?)
        else
            super
        end

    end

    def location
        most_recent_device = (devices || []).select { |device| device.location }.sort_by { |device| device.location.timestamp }.last
        if most_recent_device.nil?
            return nil
        else
            return most_recent_device.location
        end
    end

    def build_device(attributes)
        CustomerDevice.new(attributes.merge(customer: self))
    end

    def merge_attributes!(new_attributes)
        new_attributes.each do |k, v|
            self[k] = v if self.respond_to?("#{k}=")
        end
    end

    def create
        return false if !valid?
        run_callbacks :create do
            run_callbacks :save do
                mongo_client[collection_name].insert_one(to_doc.merge("created_at" => Time.zone.now))
                self.new_record = false
                true
            end
        end
        self.new_record = false
        changes_applied
        return self
    end

    def save
        return false if !valid?
        if new_record?
            create
        else
            run_callbacks :save do
                # check to see if any devices changed
                #  if devices has changed we need to loop through the ones that have changes
                # else just use simple find update
                if devices.any? { |device| device.changes.any? }
                    customer_changes = changes
                    customer_changes.delete(:devices)

                    devices.each do |device|
                        next if device.changes.empty?

                        setters = device.changes.select{|k,v| v.last != VirtusDirtyAttributes::Undefined }.inject({}) do |hash, (k,v)|
                            new_value = v.last
                            new_value = new_value.to_doc if new_value.respond_to?(:to_doc)
                            hash.merge!({"devices.$.#{k.to_s}" => new_value})
                            hash
                        end

                        unsetters = device.changes.select{|k,v| v.last == VirtusDirtyAttributes::Undefined }.inject({}) do |hash, (k,v)|
                            hash.merge!({"devices.$.#{k.to_s}" => ""})
                            hash
                        end

                        setters.merge!("devices.$.updated_at" => Time.zone.now)

                        setters = customer_changes.select{|k,v| v.last != VirtusDirtyAttributes::Undefined }.inject(setters) do |hash, (k,v)|
                            new_value = v.last
                            new_value = new_value.to_doc if new_value.respond_to?(:to_doc)
                            hash.merge!({k.to_s => new_value})
                            hash
                        end

                        setters.merge!("updated_at" => Time.zone.now)

                        update_command = {}

                        if setters.any?
                            update_command.merge!("$set" => setters)
                        end

                        if unsetters.any?
                            update_command.merge!("$unset" => unsetters)
                        end
                        
                        mongo_client[collection_name].find({"_id" => self._id, "devices._id" => device._id}).update_one(update_command)
                        customer_changes = {}
                    end
                elsif self.changes.any?
                    customer_changes = changes
                    customer_changes.delete(:devices)

                    setters = customer_changes.select{|k,v| v.last != VirtusDirtyAttributes::Undefined }.inject({}) do |hash, (k,v)|
                        new_value = v.last
                        new_value = new_value.to_doc if new_value.respond_to?(:to_doc)
                        hash.merge!({k.to_s => new_value})
                        hash
                    end

                    setters.merge!("updated_at" => Time.zone.now)
                    mongo_client[collection_name].find({"_id" => self._id}).update_one({"$set" => setters})
                end
                self.new_record = false
                true # last line must return true if all changes went through
            end
            changes_applied
            devices.each(&:changes_applied)
        end
        return self
    end

    def update_attribute(attribute)
        mongo_client[collection_name].find("_id" => self._id).update_one({"$set" => attribute})
    end

    def update_attributes(attributes)
        mongo_client[collection_name].find("_id" => self._id).update_one({"$set" => attributes})
    end

    def update(update_params)
        mongo_client[collection_name].find("_id" => self._id).update_one(update_params)
    end

    def remove_device(device)
        self.devices.delete_if{|stored_device| stored_device._id == device._id}
        run_callbacks :save do
            mongo_client[collection_name].find({"_id" => self._id}).update_one({"$set" => { "updated_at" => Time.zone.now }, "$pull" => {"devices" => {"_id" => device._id}}})
        end
        changes_applied
        return true
    end

    def add_device(device)
        return false if !device.valid?
        return true if devices.one?{ |stored_device| stored_device._id == device._id }
        self.devices << device
        run_callbacks :save do
            mongo_client[collection_name].find({"_id" => self._id}).update_one({ "$set" => { "updated_at" => Time.zone.now }, "$push" => {"devices" => device.to_doc}})
        end
        changes_applied
        return true
    end

    def destroy
        return if new_record?
        run_callbacks :destroy do
            mongo_client[collection_name].delete_one("_id" => self._id)
        end
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

    # private

    def format_variable(value)
        value.nil? ? "nil" : value
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
            self.destroy
        elsif identifier.nil? && devices.any?
            self.index_elasticsearch_document
        elsif !identifier.nil?
            self.index_elasticsearch_document
        end
    end

    def index_elasticsearch_document(opts = {})

        changed_device = devices.find{|d| d.changes.any? }

        if changed_device && changed_device.changes.include?(:location) && changed_device.changes.length == 1 && !changed_device.location_updated?
            Rails.logger.info("Skipping Elasticsearch index because only location timestamp has changed".green.bold)
            return
        end

        Rails.logger.info("Indexing #{self._id} to Elasticsearch".green.bold)
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
