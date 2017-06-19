class V1::PlacesController < V1::ApplicationController
    before_action :authenticate
    before_action :validate_json_schema, only: [:create, :update]
    before_action :check_access, only: [:index, :show, :create, :update, :destroy]
    before_action :set_place, only: [:show, :update, :destroy]

    allow :all, ["admin", "server"]
    
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
            query_tags.each do |tag|
                must_filter.push(
                    {
                        term:  {
                            tags: tag,
                        }
                    }
                )
            end
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

        places = Elasticsearch::Model.search(query, [Place])
        results = places.per_page(page_size).page(current_page).results
        json = {
            "data" => results.map{|place| serialize_elasticsearch_place(place)},
            "meta" => {
                "totalRecords" => results.total,
                "totalPages" => results.total_pages,
                "totalSearchableRecords" => current_account.searchable_places_count
            }
        }

        json["meta"].merge!({"suggestedViewBounds" => current_account.place_bounding_box_suggestion}) if query_bounds.nil? && current_page == 1

        render json: json
    end

    def show
        # include configurations
        should_include = ["configurations"] # auto include for now whitelist_include(["configurations"])

        json = {
            "data" => serialize_place(@place)
        }
        included = []
        # if should_include.include?("configurations")
        if @place.beacon_configurations_count > 0
            json["data"]["relationships"] = {} if json["data"]["relationships"].nil?

            json["data"]["relationships"].merge!(
                "configurations" => {
                    "data" => @place.beacon_configurations.map{|config| { "type" => "configurations", "id" => config.id.to_s }}
                }
            )

            included += @place.beacon_configurations.map{|config| serialize_beacon_configuration(config)}
        end

        if included.any?
            json["included"] = included
        end

        render json: json
    end

    def update
        # do we accept a google place id?
        json = flatten_request({single_record: true})
        begin
            if @place.update_attributes(place_params(json[:data]))
                json = {
                    "data" => serialize_place(@place)
                }
                render json: json
            else
                render json: { errors: V1::PlaceErrorSerializer.serialize(@place.errors)}, status: :unprocessable_entity
            end
        rescue ActiveRecord::RecordNotUnique => e
            render json: {errors: [{detail: "place already exists with the same latitude and longitude", source: {pointer: "data"}}]}, status: :unprocessable_entity
        end
    end

    def create
        json = flatten_request({single_record: true})
        @place = current_account.places.build(place_params(json[:data]))
        begin
            if @place.save
                json = {
                    "data" => serialize_place(@place)
                }
                render json: json
            else
                render json: { errors: V1::PlaceErrorSerializer.serialize(@place.errors)}, status: :unprocessable_entity
            end
        rescue ActiveRecord::RecordNotUnique => e
            render json: {errors: [{detail: "place already exists with the same latitude and longitude", source: {pointer: "data"}}]}, status: :unprocessable_entity
        end
    end

    def destroy
        if @place.destroy
            head :no_content
        else
            render json: {errors: V1::PlaceErrorSerializer.serialize(@place.errors)}, status: :internal_server_error
        end
    end

    def resource
        Place
    end

    private

    def set_place
        @place = current_account.places.find_by_id(params[:id])
        head :not_found if @place.nil?
    end
    # bounding box place query
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

    def place_params(local_params)
        convert_param_if_exists(local_params[:places], :name, :title)
        param_should_be_array(local_params[:places], :tags)
        local_params.fetch(:places, {}).permit(:enabled, :title, :address, :city, :province, :country, :postal_code,  :latitude, :longitude, :radius, :google_place_id, {:tags => []})
    end

    def serialize_place(place)
        {
            "type" => "places",
            "id" => place.id.to_s,
            "attributes" => {
                "name" => place.title,
                "address" => place.address,
                "city" => place.city,
                "province" => place.province,
                "country" => place.country,
                "postal-code" => place.postal_code,
                "latitude" => place.latitude,
                "longitude" => place.longitude,
                "radius" => place.radius,
                "tags" => place.tags,
                "enabled" => place.enabled,
                "shared" => place.shared,
                "configurations-count" => place.beacon_configurations_count
            }
        }
    end

    def serialize_elasticsearch_place(document)
        source = document._source
        {
            "type" => "places",
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
