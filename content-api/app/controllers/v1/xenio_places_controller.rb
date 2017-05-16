class V1::XenioPlacesController < V1::ApplicationController
    before_action :authenticate
    before_action :validate_json_schema, only: [:create, :update]
    before_action :set_xenio_place, only: [:show, :update, :destroy]

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

        search_query = XenioPlace.search(query)
        results = search_query.per_page(page_size).page(current_page).records

        json = {
            "data" => results.map{|xenio_place| serialize_xenio_place(xenio_place)},
            "meta" => {
                "totalRecords" => results.total,
                "totalPages" => results.total_pages,
                "totalSearchableRecords" => current_account.searchable_xenio_places_count
            }
        }

        render json: json
    end

    def show
        json = {
            data: serialize_xenio_place(@xenio_place)
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

    def set_xenio_place
        @xenio_place = XenioPlace.where(id: params[:id]).first
        head :not_found and return if @xenio_place.nil? 
        head :forbidden and return if @xenio_place.account_id != current_account.id 
    end

    def serialize_xenio_place(xenio_place)
        return V1::XenioPlaceSerializer.serialize(xenio_place)
    end

end
