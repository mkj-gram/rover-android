class V1::BeaconConfigurationsController < V1::ApplicationController
    before_action :authenticate

    def index


        # protocols can be an array
        # we want ones which have been shared
        # we should match our account_id all the time?
        # no if I was looking for just beacons shared with me then i wouldn't want my term to match



        types = []
        should_query = []
        should_filter = []
        must_filer = []

        # we are grabbing all of our beacons
        should_filter.push(
            {
                term: {
                    account_id: current_account.id
                }
            }
        )

        if query_protocols.empty?
            protocols = [IBeaconConfiguration.protocol, EddystoneNamespaceConfiguration.protocol, UrlConfiguration.protocol]
        else
            protocols = query_protocols
        end

        if protocols.include?(IBeaconConfiguration.protocol)
            types.push(IBeaconConfiguration)
            if query_keyword
                [:uuid, :major, :minor].each do |field|
                    should_query.push(
                        {
                            match: {
                                field => query_keyword
                            }
                        }
                    )
                end
            end
        end

        if protocols.include?(EddystoneNamespaceConfiguration.protocol)
            types.push(EddystoneNamespaceConfiguration)
            if query_keyword
                [:namespace, :namespace_id].each do |field|
                    should_query.push(
                        {
                            match: {
                                field => query_keyword
                            }
                        }
                    )
                end
            end
        end

        if protocols.include?(UrlConfiguration.protocol)
            types.push(UrlConfiguration)
        end

        # if tags are provided they must all match
        if query_tags.any?
            must_filer.push(
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
                                must: must_filer
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
                                must: must_filer
                            }
                        }
                    }
                }
            }
        end

        configurations = Elasticsearch::Model.search(query, types)
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
                "totalPages" => results.total_pages,
                "totalSearchableRecords" => current_account.searchable_beacon_configurations_count
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
        params.fetch(:filter, {}).permit(:query, :protocol, {:protocols => []}, {:tags => []})
    end

    def query_keyword
        filter_params.fetch(:query, nil)
    end

    def query_tags
        @query_tags ||= filter_params.fetch(:tags, [])
    end

    # depreciated
    def query_protocol
        @query_protocol ||= filter_params.fetch(:protocol, nil)
    end

    def query_protocols
        @query_protocols ||= -> {
            protocols = filter_params.fetch(:protocols, [])
            protocol = filter_params.fetch(:protocol, nil)
            if protocols.empty? && !protocol.nil?
                protocols = [protocol]
            end
            return protocols
        }.call
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
