class V1::RegionsController < V1::ApplicationController
    before_action :authenticate



    def index
        ibeacon_regions = IBeaconConfiguration.select("DISTINCT on(uuid) *").where(account_id: current_account.id).all
        json = {
            "data" => ibeacon_regions.map{|ibeacon_region| serialize_ibeacon_region(ibeacon_region)}
        }

        render json: json
    end



    private

    def serialize_ibeacon_region(ibeacon_region, opts = {})
        include_major = opts.fetch(:include_major, false)
        include_minor = opts.fetch(:include_minor, false)
        json = {
            "type" => "ibeacon-regions",
            "id" => ibeacon_region.region_id(include_major: include_major, include_minor: include_minor),
            "attributes" => {
                "uuid" => ibeacon_region.uuid,
                "major" => nil,
                "minor" => nil
            }
        }
        json["attributes"].merge!({"major" => ibeacon_region.major}) if include_major
        json["attributes"].merge!({"minor" => ibeacon_region.minor}) if include_minor
        return json
    end
end
