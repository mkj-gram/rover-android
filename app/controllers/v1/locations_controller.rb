class V1::LocationsController < V1::ApplicationController
    before_action :authenticate
    before_action :validate_json_schema,    only: [:create, :update]


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
            should_query.push(
                {
                    match_phrase: {
                        title: query_keyword
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

        render json: json
    end

    def show

    end

    def update

    end

    def create

    end

    def destroy

    end


    private

    def filter_params
        params.fetch(:filter, {}).permit(:query, :protocol, {:protocols => []}, {:tags => []})
    end

    def query_keyword
        filter_params.fetch(:query, nil)
    end

    def query_tags
        @query_tags ||= filter_params.fetch(:tags, [])
    end

    def serialize_elasticsearch_location(location)
        source = location._source
        {
            "type" => "locations",
            "id" => source.id,
            "attributes" => {
                "name" => source.title,
                "address" => source.address,
                "city" => source.city,
                "province" => source.province,
                "country" => source.country,
                "latitude" => source.latitude,
                "longitude" => source.longitude,
                "radius" => source.radius,
                "tags" => source.tags,
                "enabled" => source.enabled,
                "shared" => source.shared
            }
        }
    end
end
