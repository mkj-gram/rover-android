class Customer < ActiveRecord::Base
    include Elasticsearch::Model
    include Elasticsearch::Model::Callbacks

    # index_name "account_#{self.account_id}_customers"

    settings index: { number_of_shards: 1, number_of_replicas: 2 } do
        mapping do
            indexes :account_id, type: 'long', index: 'not_analyzed'
            indexes :alias, type: 'string', index: 'not_analyzed'
            indexes :name, type: 'string', index: 'not_analyzed'
            indexes :email, type: 'string', index: 'not_analyzed'
            indexes :phone_number, type: 'string', index: 'not_analyzed'
            indexes :tags, type: 'string', index: 'not_analyzed'
            indexes :traits, type: 'object'
            indexes :devices, type: 'nested' do
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
                indexes :local_notifications_enabled, type: 'boolean', index: 'not_analyzed'
                indexes :remote_notifications_enabled, type: 'boolean', index: 'not_analyzed'
                indexes :location_monitoring_enabled, type: 'boolean', index: 'not_analyzed'
                indexes :bluetooth_enabled, type: 'boolean', index: 'not_analyzed'
            end
        end
    end

    has_many :devices, class_name: "CustomerDevice"


    def as_indexed_json(options = {})
        {
            account_id: self.account_id,
            alias: self.alias,
            name: self.name,
            email: self.email,
            phone_number: self.phone_number,
            tags: self.tags,
            traits: self.traits,
            devices: devices_as_indexed_json(options)
        }
    end

    def attributes_signature
        SignatureHelper.createsig({ id: self.id, alias: self.alias, traits: self.traits })
    end

    def update_attributes_async(new_attributes)
        if needs_update?(new_attributes)
            UpdateCustomerAttributesWorker.perform_async(self.id, new_attributes)
        end
    end

    def merge_and_update_attributes(new_attributes)
        new_traits = new_attributes.delete(:traits)
        new_tags = new_attributes.delete(:tags)

        new_attributes[:traits] = self.traits.merge!(new_traits) if new_traits && new_traits.any?
        new_attributes[:tags] = (self.tags + new_tags).uniq if new_tags && new_tags.any?



        if new_attributes.any?
            self.update_attributes(new_attributes)
        end
    end

    private

    def devices_as_indexed_json(options)
        self.devices.map{|device| device.as_indexed_json(options)}
    end

    def needs_update?(new_attributes)
        true
    end

end
