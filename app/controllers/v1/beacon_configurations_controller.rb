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

        # all fields unless a protocol is speicifed
        query_multi_match_fields = ["uuid", "major", "minor", "namespace", "namespace_id", "url"]

        if !query_protocol.nil?
            if query_protocol == IBeaconConfiguration.protocol
                filter[:bool][:must].push(
                    {
                        type: {
                            value: "ibeacon_configuration"
                        }
                    }
                )

                query_multi_match_fields = ["uuid", "major", "minor"]

            elsif query_protocol == EddystoneNamespaceConfiguration.protocol
                filter[:bool][:must].push(
                    {
                        type: {
                            value: "eddystone_namespace_configuration"
                        }
                    }
                )

                query_multi_match_fields = ["namespace", "namespace_id"]

            elsif query_protocol == UrlConfiguration.protocol
                filter[:bool][:must].push(
                    {
                        type: {
                            value: "url_configuration"
                        }
                    }
                )

                query_multi_match_fields = ["url"]
            else
                # they are specifying a protocol which doesn't exist
                render_empty_data
                return
            end
        end




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

        if !query_keyword.nil?

            query = {
                bool: {
                    should: [
                        {
                            match_phrase: {
                                title: query_keyword
                            }
                        },
                        {
                            multi_match: {
                                query: query_keyword,
                                fields: query_multi_match_fields
                            }
                        }
                    ]
                }
            }
        else
            query = {match_all:{}}
        end

        querybuilder = {
            query: {
                filtered: {
                    query: query,
                    filter: filter
                }
            }
        }

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
                elsif config._type == EddystoneNamespaceConfiguration.document_type
                    serialize_eddystone_namespace(config)
                elsif config._type == UrlConfiguration.document_type
                    serialize_url(config)
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


    def serialize_beacon(config, extra_attributes = {})
        source = config._source
        {
            "type" => "configurations",
            "id" => config._id,
            "attributes" => {
                "name" => source.title,
                "tags" => source.tags,
                "shared" => source.shared,
                "enabled" => source.enabled
            }.merge(extra_attributes)
        }
    end

    def serialize_ibeacon(config)
        source = config._source
        serialize_beacon(
            config,
            {
                "protocol" => IBeaconConfiguration.protocol,
                "uuid" => source.uuid,
                "major-number" => source.major,
                "minor-number" => source.minor,
            }
        )
    end

    def serialize_eddystone_namespace(config)
        source = config._source
        serialize_beacon(
            config,
            {

                "protocol" => EddystoneNamespaceConfiguration.protocol,
                "namespace" => source.namespace,
                "instance-id" => source.instance_id

            }
        )
    end

    def serialize_url(config)
        source = config._source
        serialize_beacon(
            config,
            {
                "protocol" => UrlConfiguration.protocol,
                "url" => source.url
            }
        )
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
