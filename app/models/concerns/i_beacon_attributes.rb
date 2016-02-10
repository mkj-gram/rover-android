module IBeaconAttributes
    extend ActiveSupport::Concern

    included do
        before_validation :clear_unused_attributes
        before_validation :upcase_uuid

        validates :uuid, presence: true, :format => {:with => /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i}
        validates :major, presence: true, inclusion: { in: 0..65535, message: "must be between 0 and 65535" }
        validates :minor, presence: true, inclusion: { in: 0..65535, message: "must be between 0 and 65535" }
    end

    def namespace=(v)
        v
    end

    def instance_id=(v)
        v
    end

    def url=(v)
        v
    end

    def uuid_changed?
        changes.include?(:uuid)
    end

    def major_changed?
        changes.include?(:major)
    end

    def minor_changed?
        changes.include?(:minor)
    end

    def configuration_attributes
        {
            uuid: self.uuid,
            :"major-number" => self.major,
            :"minor-number" => self.minor
        }
    end

    private

    def upcase_uuid
        self.uuid.upcase if !self.uuid.nil?
    end

    def clear_unused_attributes
        blacklist_attributes = [:namespace, :instance_id, :url]
        blacklist_attributes.each {|attr| self[attr] = nil }
    end
end
