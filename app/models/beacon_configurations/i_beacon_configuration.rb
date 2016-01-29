class IBeaconConfiguration < BeaconConfiguration
    include Elasticsearch::Model
    include Elasticsearch::Model::Callbacks
    include IBeaconAttributes

    index_name BeaconConfiguration.index_name
    document_type "ibeacon_configuration"

    # this needs to be in the parent class
    mapping do
        indexes :account_id, type: 'long', index: 'not_analyzed'
        indexes :title, type: 'string', analyzer: "autocomplete", search_analyzer: "simple"
        indexes :tags, type: 'string', index: 'not_analyzed'
        indexes :shared_account_ids, type: 'long', index: 'not_analyzed'
        indexes :uuid, type: 'string', analyzer: "lowercase_keyword", search_analyzer: "lowercase_keyword"
        indexes :major, type: 'string', index: 'not_analyzed'
        indexes :minor, type: 'string', index: 'not_analyzed'
        indexes :created_at, type: 'date'
        indexes :devices_meta, type: 'object' do
            indexes :type, type: 'string', index: "no"
            indexes :count, type: 'integer', index: "no"
        end
        # didn't get to work but we should learn this for future
        indexes :suggest_tags, type: 'completion', analyzer: 'simple', search_analyzer: 'simple', payloads: false, context: {
            account_id: {
                type: "category",
                path: "account_id"
            },
            shared_account_ids: {
                type: "category",
                path: "shared_account_ids"
            }
        }
    end

    validates :account_id, presence: true
    # don't enforce an account owner
    # validate :uuid_account_owner
    # validate :unique_ibeacon



    def self.protocol
        @protocol ||= "iBeacon"
    end

    def protocol
        IBeaconConfiguration.protocol
    end

    def as_indexed_json(options = {})
        json = super(options)
        json.merge!(
            {
                uuid: self.uuid,
                major: self.major.to_s,
                minor: self.minor.to_s,
            }

        )
        return json
    end

    def attributes_json
        json = super
        json.merge!(
            {
                protocol: self.protocol,
                uuid: self.uuid,
                major: self.major,
                minor: self.minor
            }
        )
        return json
    end

    def configuration_attributes
        {
            uuid: self.uuid,
            major: self.major,
            minor: self.minor
        }
    end

    def beacon_devices
        @beacon_devices ||= BeaconDevice.where(account_id: self.account_id, uuid: self.uuid, major: self.major, minor: self.minor)
    end

    private


    def uuid_account_owner
        if self.uuid_changed?
            existing_uuid_config = BeaconConfiguration.find_by_uuid(self.uuid)
            if !existing_uuid_config.nil? && existing_uuid_config.account_id != self.account_id
                errors.add(:uuid, "has already been taken")
            end
        end
    end

    def unique_ibeacon
        if self.uuid_changed? || self.major_changed? || self.minor_changed?
            if IBeaconConfiguration.exists?(uuid: self.uuid, major: self.major, minor: self.minor)
                errors.add(:ibeacon, "already exists")
            end
        end
    end

end
