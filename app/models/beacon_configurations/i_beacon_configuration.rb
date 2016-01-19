class IBeaconConfiguration < BeaconConfiguration
    include Elasticsearch::Model
    include Elasticsearch::Model::Callbacks

    index_name BeaconConfiguration.index_name
    document_type "ibeacon_configuration"

    # this needs to be in the parent class
    mapping do
        indexes :account_id, type: 'long', index: 'not_analyzed'
        indexes :title, type: 'string', analyzer: "autocomplete", search_analyzer: "simple"
        indexes :tags, type: 'string'
        indexes :shared_account_ids, type: 'long', index: 'not_analyzed'
        indexes :uuid, type: 'string', index: 'not_analyzed'
        indexes :major, type: 'string', index: 'not_analyzed'
        indexes :minor, type: 'string', index: 'not_analyzed'
        indexes :created_at, type: 'date'
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

    before_validation :clear_unused_attributes
    before_validation :upcase_uuid

    validates :account_id, presence: true
    validates :uuid, presence: true, :format => {:with => /[A-Za-z\d]([-\w]{,498}[A-Za-z\d])?/i}
    validates :major, presence: true
    validates :minor, presence: true
    validate :uuid_account_owner
    validate :unique_ibeacon

    def self.protocol
        @protocol ||= "iBeacon"
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

    private

    def upcase_uuid
        self.uuid.upcase
    end

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

    def clear_unused_attributes
        blacklist_attributes = [:namespace, :instance_id, :url]
        blacklist_attributes.each {|attr| self[attr] = nil }
    end
end
