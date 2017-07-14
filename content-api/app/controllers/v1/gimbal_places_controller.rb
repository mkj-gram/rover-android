class V1::GimbalPlacesController < V1::ApplicationController
    before_action :authenticate
    before_action :validate_json_schema, only: [:create, :update]
    before_action :set_gimbal_place, only: [:show, :update, :destroy]

    allow :admin, :server
    
    def index
        should_query = []
        should_filter = []
        must_filter = []

        # we are grabbing all of our beacons
        must_filter.push(
            {
                term: {
                    account_id: current_account.id
                }
            }
        )

        if query_keyword
            # search based on title
            should_query.push(
                {
                    match_phrase: {
                        name: query_keyword
                    }
                }
            )
        end

        if query_keyword.nil?
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

        search_query = Elasticsearch::Model.search(query, [GimbalPlace])
        results = search_query.per_page(page_size).page(current_page).results

        json = {
            "data" => results.map{|gimbal_place| serialize_elasticsearch_gimbal_place(gimbal_place)},
            "meta" => {
                "totalRecords" => results.total,
                "totalPages" => results.total_pages,
                "totalSearchableRecords" => current_account.gimbal_places_count
            }
        }

        render json: json
    end

    def show
        json = {
            data: serialize_gimbal_place(@gimbal_place)
        }

        render json: json
    end

    private

    def filter_params
        params.fetch(:filter, {}).permit(:query)
    end

    def query_keyword
        filter_params.fetch(:query, nil)
    end

    def set_gimbal_place
        @gimbal_place = GimbalPlace.where(id: params[:id]).first
        head :not_found and return if @gimbal_place.nil? 
        head :forbidden and return if @gimbal_place.account_id != current_account.id 
    end

    def serialize_gimbal_place(gimbal_place)
        {
            id: gimbal_place.id.to_s,
            type: 'gimbal-places',
            attributes: {
                name: gimbal_place.name,
            }
        }
    end

    def serialize_elasticsearch_gimbal_place(gimbal_place)
        source = gimbal_place._source
        {
            id: gimbal_place.id,
            type: 'gimbal-places',
            attributes: {
                name: source.name
            }
        }
    end
end