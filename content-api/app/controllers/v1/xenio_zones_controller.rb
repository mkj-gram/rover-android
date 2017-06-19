class V1::XenioZonesController < V1::ApplicationController
    before_action :authenticate
    before_action :validate_json_schema, only: [:create, :update]
    before_action :set_xenio_zone, only: [:show, :update, :destroy]

    allow :all, ["admin", "server"]

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

        search_query = XenioZone.search(query)
        results = search_query.per_page(page_size).page(current_page).records

        json = {
            "data" => results.map{|xenio_zone| serialize_xenio_zone(xenio_zone)},
            "meta" => {
                "totalRecords" => results.total,
                "totalPages" => results.total_pages,
                "totalSearchableRecords" => current_account.searchable_xenio_zones_count
            }
        }

        render json: json
    end

    def show
        json = {
            data: serialize_xenio_zone(@xenio_zone)
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

    def set_xenio_zone
        @xenio_zone = XenioZone.where(id: params[:id]).first
        head :not_found and return if @xenio_zone.nil? 
        head :forbidden and return if @xenio_zone.account_id != current_account.id 
    end

    def serialize_xenio_zone(xenio_zone)
        return V1::XenioZoneSerializer.serialize(xenio_zone)
    end
end
