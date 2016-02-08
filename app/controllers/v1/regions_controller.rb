class V1::RegionsController < V1::ApplicationController
    before_action :authenticate



    def index
        types = filter_types.dig(:types)


        if types.include?("ibeacon")
            ibeacon_regions = IBeaconConfiguration.select("DISTINCT on(uuid) *").where(account_id: current_account.id).limit(page_size)
        else
            ibeacon_regions = []
        end


        if types.include?("geofence")

        else
            geofence_regions = []
        end

        data = (ibeacon_regions.map{|ibeacon_region| serialize_ibeacon_region(ibeacon_region)} + geofence_regions).first(page_size)
        json = {
            "data" => data
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
                "major-number" => nil,
                "minor-number" => nil
            }
        }
        json["attributes"].merge!({"major-number" => ibeacon_region.major}) if include_major
        json["attributes"].merge!({"minor-number" => ibeacon_region.minor}) if include_minor
        return json
    end

    def serialize_geofence_region(geofence_region)

    end


    def filter_types
        # {filter: types: [ibeacon,geofence]}
        params.fetch(:filter, {types: ["ibeacon", "geofence"]}).permit({:types => []})
    end
end
