class V1::BeaconConfigurationsController < V1::ApplicationController
    before_action :authenticate

    def index
        configurations = BeaconConfiguration.__elasticsearch__.search(
            query: {
                filtered: {
                    query: {
                        match_all: {}
                    },
                    filter: {
                        term: {
                            account_id: current_account.id
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
        )

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

end
