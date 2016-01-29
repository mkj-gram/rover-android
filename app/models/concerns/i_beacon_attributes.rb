module IBeaconAttributes
    extend ActiveSupport::Concern

    included do
        before_validation :clear_unused_attributes
        before_validation :upcase_uuid

        validates :uuid, presence: true, :format => {:with => /[A-Za-z\d]([-\w]{,498}[A-Za-z\d])?/i}
        validates :major, presence: true
        validates :minor, presence: true
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
