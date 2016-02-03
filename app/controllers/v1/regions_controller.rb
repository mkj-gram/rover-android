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
            geofence_regions = [{"type"=>"geofence-regions",
                                 "id"=>"43.7680568:-79.4219655",
                                 "attributes"=>
                                 {"radius"=>50, "longitude"=>-79.4219655, "latitude"=>43.7680568}},
                                {"type"=>"geofence-regions",
                                 "id"=>"43.768624018331934:-79.41419629234315",
                                 "attributes"=>
                                 {"radius"=>89,
                                "longitude"=>-79.41419629234315,
                                "latitude"=>43.768624018331934}},
                                {"type"=>"geofence-regions",
                                 "id"=>"43.8390151:-79.39192430000003",
                                 "attributes"=>
                                 {"radius"=>50, "longitude"=>-79.39192430000003, "latitude"=>43.8390151}},
                                {"type"=>"geofence-regions",
                                 "id"=>"43.6618185:-79.38591350000002",
                                 "attributes"=>
                                 {"radius"=>50, "longitude"=>-79.38591350000002, "latitude"=>43.6618185}},
                                {"type"=>"geofence-regions",
                                 "id"=>"43.6412461:-79.41467949999998",
                                 "attributes"=>
                                 {"radius"=>150, "longitude"=>-79.41467949999998, "latitude"=>43.6412461}},
                                {"type"=>"geofence-regions",
                                 "id"=>"43.644629:-79.392933",
                                 "attributes"=>
                                 {"radius"=>100, "longitude"=>-79.392933, "latitude"=>43.644629}},
                                {"type"=>"geofence-regions",
                                 "id"=>"43.6262598:-79.51474840000003",
                                 "attributes"=>
                                 {"radius"=>50, "longitude"=>-79.51474840000003, "latitude"=>43.6262598}},
                                {"type"=>"geofence-regions",
                                 "id"=>"43.35387645646609:-79.75814637354125",
                                 "attributes"=>
                                 {"radius"=>60,
                                "longitude"=>-79.75814637354125,
                                "latitude"=>43.35387645646609}},
                                {"type"=>"geofence-regions",
                                 "id"=>"43.352926792566436:-79.77674197738497",
                                 "attributes"=>
                                 {"radius"=>60,
                                "longitude"=>-79.77674197738497,
                                "latitude"=>43.352926792566436}},
                                {"type"=>"geofence-regions",
                                 "id"=>"43.643305:-79.426916",
                                 "attributes"=>
                                 {"radius"=>50, "longitude"=>-79.426916, "latitude"=>43.643305}},
                                {"type"=>"geofence-regions",
                                 "id"=>"43.5937038:-79.63109250000002",
                                 "attributes"=>
                                 {"radius"=>50, "longitude"=>-79.63109250000002, "latitude"=>43.5937038}},
                                {"type"=>"geofence-regions",
                                 "id"=>"43.65109:-79.389905",
                                 "attributes"=>{"radius"=>50, "longitude"=>-79.389905, "latitude"=>43.65109}},
                                {"type"=>"geofence-regions",
                                 "id"=>"43.771565:-79.512088",
                                 "attributes"=>
                                 {"radius"=>50, "longitude"=>-79.512088, "latitude"=>43.771565}},
                                {"type"=>"geofence-regions",
                                 "id"=>"43.8109084:-79.35064210000002",
                                 "attributes"=>
                                 {"radius"=>50, "longitude"=>-79.35064210000002, "latitude"=>43.8109084}},
                                {"type"=>"geofence-regions",
                                 "id"=>"43.644629:-79.392933",
                                 "attributes"=>
                                 {"radius"=>50, "longitude"=>-79.392933, "latitude"=>43.644629}},
                                {"type"=>"geofence-regions",
                                 "id"=>"43.650854:-79.376008",
                                 "attributes"=>
                                 {"radius"=>100, "longitude"=>-79.376008, "latitude"=>43.650854}}]
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
