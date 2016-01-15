class V1::BeaconConfigurationsController < V1::ApplicationController
    before_action :authenticate

    def index
        filter = {
            bool: {
                should: [
                    {
                        term: {
                            account_id: current_account.id
                        }
                    },
                    {
                        term: {
                            shared_account_ids: current_account.id
                        }
                    }
                ],
                must: []
            }
        }

        if !query_protocol.nil?
            if query_protocol == "iBeacon"
                filter[:bool][:must].push(
                    {
                        type: {
                            value: "ibeacon_configuration"
                        }
                    }
                )
            elsif query_protocol == "Eddystone-UUID"
                filter[:bool][:must].push(
                    {
                        type: {
                            value: "eddystone_namespace_configuration"
                        }
                    }
                )
            elsif query_protocol == "Url"
                filter[:bool][:must].push(
                    {
                        type: {
                            value: "url_configuration"
                        }
                    }
                )
            else
                # they are specifying a protocol which doesn't exist
                render_empty_data
                return
            end
        end

        querybuilder = {
            query: {
                filtered: {
                    query: {
                        match_all: {}
                    },
                    filter: filter
                }
            }
        }


        if !query_tags.nil?
            filter[:bool][:must].push(
                {
                    terms: {
                        tags: query_tags,
                        execution: "and"
                    }
                }
            )
        end

        if query_keyword.nil? && query_tags.nil?
            querybuilder.merge!(
                {
                    sort: [
                        {
                            created_at: {
                                order: "desc"
                            }
                        }
                    ]
                }
            )
        end
        configurations = BeaconConfiguration.__elasticsearch__.search(querybuilder)
        results = configurations.per_page(page_size).page(current_page).results
        json  = {
            "data" => results.map do |config|
                if config._type == IBeaconConfiguration.document_type
                    serialize_ibeacon(config)
                end
            end,
            "meta" => {
                "totalRecords" => results.total,
                "totalPages" => results.total_pages
            },
            "links" => pagination_links(v1_beacon_configuration_index_url, results)
        }

        render json: json
    end

    def create

    end

    def update
    end

    def destroy
    end

    private

    def filter_params
        params.fetch(:filter, {}).permit(:protocol, {:tags => []}, :query)
    end

    def query_keyword
        filter_params.fetch(:query, nil)
    end

    def query_tags
        filter_params.fetch(:tags, nil)
    end

    def query_protocol
        filter_params.fetch(:protocol, nil)
    end


    def serialize_ibeacon(config)
        source = config._source
        {
            "type" => "configurations",
            "id" => config._id,
            "attributes" => {
                "protocol" => "ibeacon",
                "name" => source.title,
                "uuid" => source.uuid,
                "major-number" => source.major,
                "minor-number" => source.minor,
                "tags" => source.tags
            }
        }
    end

    def render_empty_data
        render json: {
            data: [],
            meta: {
                totalPages: 0,
                totalRecords: 0
            }
        }
    end

end
