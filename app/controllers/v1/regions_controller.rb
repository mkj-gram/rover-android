class V1::RegionsController < V1::ApplicationController
    before_action :authenticate



    def index
        types = filter_types.dig(:types)


        if types.include?("ibeacon")
            ibeacon_regions = IBeaconConfiguration.select("DISTINCT on(uuid) *").where(account_id: current_account.id).limit(page_size)
        else
            ibeacon_region = []
        end

        if types.include?("geofence")
            geofence_regions = [
                {
                    "type" => "geofence-regions",
                    "id" => "43.7680567999999965:-79.4219654999999989",
                    "attributes" => {
                        "radius": 50,
                        "longitude": -79.4219654999999989,
                        "latitude": 43.7680567999999965
                    }
                },
                {
                    "type" => "geofence-regions",
                    "id" => "43.7686240183319342:-79.4141962923431493",
                    "attributes" => {
                        "radius": 89,
                        "longitude": -79.4141962923431493,
                        "latitude": 43.7686240183319342
                    }
                },
                {
                    "type" => "geofence-regions",
                    "id" => "43.7680567999999965:-79.4219654999999989",
                    "attributes" => {
                        "radius": 50,
                        "longitude": -79.4219654999999989,
                        "latitude": 43.7680567999999965
                    }
                },
                {
                    "type" => "geofence-regions",
                    "id" => "43.7686240183319342:-79.4141962923431493",
                    "attributes" => {
                        "radius": 89,
                        "longitude": -79.4141962923431493,
                        "latitude": 43.7686240183319342
                    }
                }
            ]
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
                "major" => nil,
                "minor" => nil
            }
        }
        json["attributes"].merge!({"major" => ibeacon_region.major}) if include_major
        json["attributes"].merge!({"minor" => ibeacon_region.minor}) if include_minor
        return json
    end

    def serialize_geofence_region(geofence_region)

    end


    def filter_types
        # {filter: types: [ibeacon,geofence]}
        params.fetch(:filter, {types: ["ibeacon", "geofence"]}).permit({:types => []})
    end
end
