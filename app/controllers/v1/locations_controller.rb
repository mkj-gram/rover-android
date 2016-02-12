class V1::LocationsController < V1::ApplicationController
    before_action :authenticate
    before_action :validate_json_schema, only: [:create, :update]
    before_action :set_location, only: [:show, :update, :destroy]

    def index
        should_query = []
        should_filter = []
        must_filter = []

        # we are grabbing all of our beacons
        should_filter.push(
            {
                term: {
                    account_id: current_account.id
                }
            }
        )

        begin
            bounds_filter = query_bounds
        rescue GeoFilter::GeoBoundingBox::InvalidBoundsFormat => e
            render json: { errors: [{detail: e.message, status: "400"}]}, status: 400
            return
        end

        must_filter.push(query_bounds.to_elasticsearch_filter("location")) if bounds_filter


        # if tags are provided they must all match
        if query_tags.any?
            must_filter.push(
                {
                    terms:  {
                        tags: query_tags,
                        execution: "and"
                    }
                }
            )
        end

        if query_keyword
            # search based on title
            should_query.push(
                {
                    match_phrase: {
                        title: query_keyword
                    }
                }
            )
            # search based on formatted address
            should_query.push(
                {
                    match_phrase: {
                        formatted_address: query_keyword
                    }
                }
            )
        end

        if query_keyword.nil? && query_tags.empty?
            query = {
                query: {
                    filtered: {
                        query: {match_all: {}},
                        filter: {
                            bool: {
                                should: should_filter,
                                must: must_filter
                            }
                        }
                    }
                },
                sort: [
                    {
                        created_at: {
                            order: "desc"
                        }
                    }
                ]
            }
        else
            query = {
                query: {
                    filtered: {
                        query: {
                            bool: {
                                should: should_query
                            }
                        },
                        filter: {
                            bool: {
                                should: should_filter,
                                must: must_filter
                            }
                        }
                    }
                }
            }
        end

        locations = Elasticsearch::Model.search(query, [Location])
        results = locations.per_page(page_size).page(current_page).results
        json = {
            "data" => results.map{|location| serialize_elasticsearch_location(location)},
            "meta" => {
                "totalRecords" => results.total,
                "totalPages" => results.total_pages,
                "totalSearchableRecords" => current_account.searchable_locations_count
            }
        }

        json["meta"].merge!({"suggestedViewBounds" => current_account.location_bounding_box_suggestion}) if query_bounds.nil? && current_page == 1

        render json: json
    end

    def show
        # include configurations
        should_include = whitelist_include(["configurations"])

        json = {
            "data" => serialize_location(@location)
        }
        included = []
        # if should_include.include?("configurations")
        if @location.beacon_configurations_count > 0
            json["data"]["relationships"] = {} if json["data"]["relationships"].nil?

            json["data"]["relationships"].merge!(
                "configurations" => {
                    "data" => @location.beacon_configurations.map{|config| { "type" => "configurations", "id" => config.id.to_s }}
                }
            )

            included += @location.beacon_configurations.map{|config| serialize_beacon_configuration(config)}
        end

        if included.any?
            json["included"] = included
        end

        render json: json
    end

    def update
        # do we accept a google place id?
        json = flatten_request({single_record: true})
        if @location.update_attributes(location_params(json[:data]))
            json = {
                "data" => serialize_location(@location)
            }
            render json: json
        else
            render json: { errors: V1::LocationErrorSerializer.serialize(@location.errors)}, status: :unprocessable_entity
        end
    end

    def create
        json = flatten_request({single_record: true})
        @location = current_account.locations.build(location_params(json[:data]))
        if @location.save
            json = {
                "data" => serialize_location(@location)
            }
            render json: json
        else
            render json: { errors: V1::LocationErrorSerializer.serialize(@location.errors)}, status: :unprocessable_entity
        end
    end

    def destroy
        if @location.destroy
            head :no_content
        else
            render json: {errors: V1::LocationErrorSerializer.serialize(@location.errors)}, status: :internal_server_error
        end
    end


    private

    def set_location
        @location = Location.find_by_id(params[:id])
        head :not_found if @location.nil?
    end
    # bounding box location query
    # or point

    def filter_params
        params.fetch(:filter, {}).permit(:query, :bounds, {:bounds => []}, {:tags => []})
    end

    def query_keyword
        filter_params.fetch(:query, nil)
    end

    def query_bounds
        @query_bounds ||= -> {
            return nil if !filter_params.has_key?(:bounds)
            return GeoFilter::GeoBoundingBox.new(filter_params.fetch(:bounds, []))
        }.call
    end

    def query_tags
        @query_tags ||= filter_params.fetch(:tags, [])
    end

    def location_params(local_params)
        convert_param_if_exists(local_params[:locations], :name, :title)
        local_params.fetch(:locations, {}).permit(:enabled, :title, :address, :city, :province, :country, :postal_code,  :latitude, :longitude, :radius, :google_place_id, {:tags => []})
    end

    def serialize_location(location)
        {
            "type" => "locations",
            "id" => location.id.to_s,
            "attributes" => {
                "name" => location.title,
                "address" => location.address,
                "city" => location.city,
                "province" => location.province,
                "country" => location.country,
                "postal-code" => location.postal_code,
                "latitude" => location.latitude,
                "longitude" => location.longitude,
                "radius" => location.radius,
                "tags" => location.tags,
                "enabled" => location.enabled,
                "shared" => location.shared,
                "configurations-count" => location.beacon_configurations_count
            }
        }
    end

    def serialize_elasticsearch_location(document)
        source = document._source
        {
            "type" => "locations",
            "id" => document.id,
            "attributes" => {
                "name" => source.title,
                "address" => source.address,
                "city" => source.city,
                "province" => source.province,
                "country" => source.country,
                "postal_code" => source.postal_code,
                "latitude" => source.location.lat,
                "longitude" => source.location.lon,
                "radius" => source.radius,
                "tags" => source.tags,
                "enabled" => source.enabled,
                "shared" => source.shared,
                "configurations-count" => source.beacon_configurations_count || 0
            }
        }
    end

    def serialize_beacon_configuration(beacon_configuration)
        {
            "type" => "configurations",
            "id" => beacon_configuration.id.to_s,
            "attributes" => {
                "name" => beacon_configuration.title,
                "tags" => beacon_configuration.tags,
                "shared" => beacon_configuration.shared,
                "enabled" => beacon_configuration.enabled,
                "device-type" => beacon_configuration.devices_meta[:type],
                "device-count" => beacon_configuration.devices_meta[:count] || 0,
                "protocol" => beacon_configuration.protocol,
            }.merge(beacon_configuration.configuration_attributes)
        }
    end
end
