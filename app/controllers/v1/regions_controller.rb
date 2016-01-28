class V1::RegionsController < V1::ApplicationController
    before_action :authenticate



    def index
        beacon_regions = IBeaconConfiguration.select("DISTINCT on(uuid) *").where(account_id: current_account.id).all
        json = {
            "data" => beacon_regions.map{|beacon_region| serialize_beacon_region(beacon_region)}
        }

        render json: json
    end



    private

    def serialize_beacon_region(beacon_region, opts = {})
        include_major = opts.fetch(:include_major, false)
        include_minor = opts.fetch(:include_minor, false)
        json = {
            "type" => "beacon-regions",
            "id" => beacon_region.region_id(include_major: include_major, include_minor: include_minor),
            "attributes" => {
                "uuid" => beacon_region.uuid,
                "major" => nil,
                "minor" => nil
            }
        }
        json["attributes"].merge!({"major" => beacon_region.major}) if include_major
        json["attributes"].merge!({"minor" => beacon_region.minor}) if include_minor
        return json
    end
end
