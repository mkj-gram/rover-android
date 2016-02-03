class V1::LocationsController < V1::ApplicationController
    before_action :authenticate
    before_action :validate_json_schema,    only: [:create, :update]
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

        if query_location
            must_filter.push(query_location.to_elasticsearch_filter("location"))
        end

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
                "totalSearchableRecords" => current_account.searchable_locations_count,
                "suggestedViewBounds" => current_account.location_bounding_box_suggestion
            }
        }

        render json: json
    end

    def show
        # include beacons

    end

    def update
        # do we accept a google place id?
        json = flatten_request({single_record: true})
        if @location.update_attributes(location_params(json[:data]))
        else
            render json: { errors: V1::LocationErrorSerializer.serialize(@location.errors)}, status: :unprocessable_entity
        end
    end

    def create

    end

    def destroy

    end


    private

    def set_location
        @location = Location.find_by_id(params[:id])
        head :not_found if @location.nil?
    end
    # bounding box location query
    # or point

    def filter_params
        params.fetch(:filter, {}).permit(:query, {:tags => []})
    end

    def query_keyword
        filter_params.fetch(:query, nil)
    end

    def query_location
        @query_location ||= -> {
            return nil if params.dig(:filter, :location).nil?
            return get_geo_filter(params[:filter])
        }.call
    end

    def query_tags
        @query_tags ||= filter_params.fetch(:tags, [])
    end

    def location_params(local_params)
        convert_param_if_exists(local_params[:configurations], :name, :title)
        local_params.fetch(:locations, {}).permit(:enabled, :title, :address, :city, :province, :country, :latitude, :longitude, :radius)
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
end
