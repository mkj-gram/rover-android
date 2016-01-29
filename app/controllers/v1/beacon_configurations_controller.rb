class V1::BeaconConfigurationsController < V1::ApplicationController
    before_action :authenticate
    before_action :validate_json_schema,    only: [:create, :update]

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
                    elasticsearch_serialize_ibeacon(config)
                elsif config._type == EddystoneNamespaceConfiguration.document_type
                    elasticsearch_serialize_eddystone_namespace(config)
                elsif config._type == UrlConfiguration.document_type
                    elasticsearch_serialize_url(config)
                end
            end,
            "meta" => {
                "totalRecords" => results.total,
                "totalPages" => results.total_pages,
                "totalSearchableRecords" => current_account.searchable_beacon_configurations_count
            },
            "links" => pagination_links(v1_beacon_configuration_index_url, results, {start_at: 0})
        }

        render json: json
    end

    def show
        # show a detail view of the beacon
        @beacon_configuration = BeaconConfiguration.find_by_id(params[:id])
        render_beacon_configuration(@beacon_configuration)
    end

    def create
        # this we need a protocol?
    end

    def update
        # we can update name, tags, enabled
        @beacon_configuration = BeaconConfiguration.find_by_id(params[:id])
        if @beacon_configuration
            json = flatten_request({single_record: true})
            if @beacon_configuration.update_attributes(configuration_params(json[:data]))
                render_beacon_configuration(@beacon_configuration)
            else
                render json: { errors: V1::BeaconConfigurationUpdateErrorSerializer.serialize(@beacon_configuration.errors)}, status: :unprocessable_entity
            end
        else
            head :not_found
        end
    end

    def destroy
        @beacon_configuration = BeaconConfiguration.find_by_id(params[:id])
        if @beacon_configuration
            @beacon_configuration.destroy
            head :no_content
        else
            head :not_found
        end
    end

    private

    def configuration_params(local_params)
        local_params.fetch(:configurations, {}).permit(:name, {tags: []}, :enabled)
    end

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

    def render_beacon_configuration(beacon_configuration)
        if beacon_configuration
            json = serialize_beacon(beacon_configuration, {protocol: beacon_configuration.protocol})
            devices = beacon_configuration.beacon_devices.all.to_a
            if devices.any?
                grouped_devices = devices.group_by { |beacon| beacon.manufacturer }
                # add relationship of estimote device
                # add relationship for kontakt device
                # add them in the include
                json["relationships"] = {}
                json["relationships"].merge!(serialize_estimote_relationships(grouped_devices["estimote"])) if grouped_devices.include?("estimote")
                json["relationships"].merge!(serialize_kontakt_relationships(grouped_devices["kontakt"])) if grouped_devices.include?("kontakt")

                included = []
                included += grouped_devices["estimote"].map{|device| serialize_device(device, "estimote-devices")} if grouped_devices.include?("estimote")
                included += grouped_devices["kontakt"].map{|device| serialize_device(device, "kontakt-devices")} if grouped_devices.include?("kontakt")
                json["included"] = included
            end

            render json: json
        else
            head :not_found
        end
    end

    def elasticsearch_serialize_beacon(config, extra_attributes = {})
        source = config._source
        {
            "type" => "configurations",
            "id" => config._id,
            "attributes" => {
                "name" => source.title,
                "tags" => source.tags,
                "shared" => source.shared,
                "enabled" => source.enabled,
                "device-type" => source.devices_meta[:type],
                "device-count" => source.devices_meta[:count] || 0
            }.merge(extra_attributes)
        }
    end

    def elasticsearch_serialize_ibeacon(config)
        source = config._source
        elasticsearch_serialize_beacon(
            config,
            {
                "protocol" => IBeaconConfiguration.protocol,
                "uuid" => source.uuid,
                "major-number" => source.major,
                "minor-number" => source.minor,
            }
        )
    end

    def elasticsearch_serialize_eddystone_namespace(config)
        source = config._source
        elasticsearch_serialize_beacon(
            config,
            {

                "protocol" => EddystoneNamespaceConfiguration.protocol,
                "namespace" => source.namespace,
                "instance-id" => source.instance_id

            }
        )
    end

    def elasticsearch_serialize_url(config)
        source = config._source
        elasticsearch_serialize_beacon(
            config,
            {
                "protocol" => UrlConfiguration.protocol,
                "url" => source.url
            }
        )
    end


    def serialize_beacon(beacon, extra_attributes = {})
        # include the relationships
        {
            "type" => "configurations",
            "id" => beacon.id.to_s,
            "attributes" => {
                "name" => beacon.title,
                "tags" => beacon.tags,
                "shared" => beacon.shared,
                "enabled" => beacon.enabled
            }.merge(extra_attributes)
        }
    end

    def serialize_device(device, type)
        {
            "type" => type,
            "id" => device.id.to_s,
            "attributes" => device.device_attributes.merge(device.configuration_attributes)
        }
    end

    def serialize_estimote_relationships(estimote_devices)
        {
            "estimote-devices" => {
                "data" => estimote_devices.map{|device| {type: "estimote-devices", id: device.id.to_s}}
            }
        }
    end

    def serialize_kontakt_relationships(kontakt_devices)
        {
            "kontakt-devices" => {
                "data" => kontakt_devices.map{|device| {type: "kontakt-devices", id: device.id.to_s}}
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
