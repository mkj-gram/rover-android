class V1::RegionsController < V1::ApplicationController
    before_action :authenticate



    def index
        types = query_types[:types]

        if types.include?("ibeacon")
            ibeacon_regions = IBeaconConfiguration.select("DISTINCT on(uuid) *").where(account_id: current_account.id).limit(page_size)
        else
            ibeacon_regions = []
        end


        if types.include?("geofence")
            if query_lat && query_lng
                sort = [
                    {
                        :"_geo_distance" => {
                            location: {
                                lat: query_lat,
                                lon: query_lng
                            },
                            order: "asc",
                            unit: "km",
                            :"distance_type" => "plane"
                        }
                    }
                ]

            else
                sort = [
                    {
                        created_at: {
                            order: "desc"
                        }
                    }
                ]
            end

            query = {
                query: {
                    filtered: {
                        filter: {
                            bool: {
                                should: [
                                    {
                                        term: { account_id: current_account.id }
                                    },
                                    {
                                        term: { shared_account_ids: current_account.id }
                                    }
                                ],
                                must: [
                                    {
                                        term: { enabled: true }
                                    }
                                ]
                            }
                        }
                    }
                },
                sort: sort
            }

            locations = Elasticsearch::Model.search(query, [Location])
            results = locations.per_page(page_size - ibeacon_regions.length).page(current_page).results
            geofence_regions = results.map{|result| serialize_elasticsearch_geofence_region(result)}
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

    def serialize_elasticsearch_geofence_region(geofence_region)
        source = geofence_region._source
        {
            "type" => "geofence-regions",
            "id" => "#{source.location.lat}#{source.location.lon}",
            "attributes" => {
                "latitude" => source.location.lat,
                "longitude" => source.location.lon,
                "radius" => source.radius
            }
        }
    end

    def query_lat
        lat = params.dig(:filter, :lat)
        return lat.nil? ? nil : lat.to_f
    end

    def query_lng
        lng = params.dig(:filter, :lng)
        return lng.nil? ? nil : lng.to_f
    end

    def query_types
        params.fetch(:filter, {types: ["ibeacon", "geofence"]}).permit({:types => []})
    end

end
