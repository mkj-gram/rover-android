class IBeaconRegion < ActiveModelSerializers::Model
    include Virtus.model

    attribute :id, String
    attribute :uuid, String
    attribute :major, Integer
    attribute :minor, Integer


    def serialize(opts = {})
        include_major = opts.fetch(:include_major, false)
        include_minor = opts.fetch(:include_minor, false)
        json = {
            "type" => "ibeacon-regions",
            "id" => self.region_id(include_major: include_major, include_minor: include_minor),
            "attributes" => {
                "uuid" => self.uuid,
                "major-number" => nil,
                "minor-number" => nil
            }
        }
        json["attributes"].merge!({"major-number" => ibeacon_region.major}) if include_major && !major.nil?
        json["attributes"].merge!({"minor-number" => ibeacon_region.minor}) if include_minor && !minor.nil?
        return json
    end

    def region_id(opts = {})
        id = "#{self.uuid}"
        id.concat(":#{self.major}") if opts[:include_major]
        id.concat(":-")             if !opts[:include_major] && opts[:include_minor]
        id.concat(":#{self.minor}") if opts[:include_minor]
        return id
    end

end
