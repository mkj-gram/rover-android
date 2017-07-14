class IBeaconConfiguration < BeaconConfiguration
    include Elasticsearch::Model
    include IBeaconAttributes
    include BeaconConfigurationElasticsearchChild

    document_type "ibeacon_configuration"
    # workaround since including BeaconConfigurationElasticsearchMappings before document_type
    # assumes the mapping type is of i_beacon_configuration so we have to reset it
    mappings.type = document_type

    mapping do
        indexes :uuid, type: 'string', analyzer: "lowercase_keyword", search_analyzer: "lowercase_keyword"
        indexes :major, type: 'string', index: 'not_analyzed'
        indexes :minor, type: 'string', index: 'not_analyzed'
    end

    after_create :add_uuid_to_active_uuids
    after_destroy :remove_uuid_from_active_uuids

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


    def beacon_devices
        @beacon_devices ||= BeaconDevice.where(account_id: self.account_id, uuid: self.uuid, major: self.major, minor: self.minor)
    end

    def region_id(opts = {})
        id = "#{self.uuid}"
        id.concat(":#{self.major}") if opts[:include_major]
        id.concat(":-")             if !opts[:include_major] && opts[:include_minor]
        id.concat(":#{self.minor}") if opts[:include_minor]
        return id
    end

    private

    def add_uuid_to_active_uuids
        ActiveIBeaconConfigurationUuid.update_uuids(self.account_id, [], [uuid])
    end

    def remove_uuid_from_active_uuids
        if !IBeaconConfiguration.where(account_id: self.account_id, uuid: self.uuid).exists?
            ActiveIBeaconConfigurationUuid.update_uuids(self.account_id, [uuid], [])
        end
    end

    # def update_active_uuids
    #     if self.changes.include?(:uuid)
    #         ActiveIBeaconConfigurationUuid.update_uuids(self.account_id, [uuid_was], [uuid])
    #     end
    # end

end