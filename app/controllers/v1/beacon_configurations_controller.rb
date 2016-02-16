class V1::BeaconConfigurationsController < V1::ApplicationController
    before_action :authenticate
    before_action :validate_json_schema,    only: [:create, :update]

    @@protocol_types = Set.new([IBeaconConfiguration.protocol, EddystoneNamespaceConfiguration.protocol, UrlConfiguration.protocol])

    def index


        # protocols can be an array
        # we want ones which have been shared
        # we should match our account_id all the time?
        # no if I was looking for just beacons shared with me then i wouldn't want my term to match



        types = []
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
            must_filter.push(
                {
                    terms:  {
                        tags: query_tags,
                        execution: "and"
                    }
                }
            )
        end

        if query_location_id
            must_filter.push(
                {
                    term: {
                        "location.id" => query_location_id.to_i
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

        configurations = Elasticsearch::Model.search(query, types)
        results = configurations.per_page(page_size).page(current_page).results
        include_location = true #whitelist_include(["location"]).first == "location"
        json  = {
            "data" => results.map do |config|
                if config._type == IBeaconConfiguration.document_type
                    elasticsearch_serialize_ibeacon(config, include_location)
                elsif config._type == EddystoneNamespaceConfiguration.document_type
                    elasticsearch_serialize_eddystone_namespace(config, include_location)
                elsif config._type == UrlConfiguration.document_type
                    elasticsearch_serialize_url(config, include_location)
                end
            end,
            "meta" => {
                "totalRecords" => results.total,
                "totalPages" => results.total_pages
            },
            "links" => pagination_links(v1_beacon_configuration_index_url, results, {start_at: 0})
        }

        if query_location_id
            json["meta"]["totalSearchableRecords"] = BeaconConfiguration.where(location_id: query_location_id).count
        else
            json["meta"]["totalSearchableRecords"] = current_account.searchable_beacon_configurations_count
        end

        included = []

        if whitelist_include(["location"])
            included += results.select{|config| !config._source.location.empty? }.map{|config| serialize_partial_location(config._source.location) }
        end

        if included.any?
            json["included"] = included
        end

        render json: json
    end

    def show
        # show a detail view of the beacon
        @beacon_configuration = BeaconConfiguration.find_by_id(params[:id])
        render_beacon_configuration(@beacon_configuration)
    end

    def create
        # this we need a protocol?
        json = flatten_request({single_record: true})
        protocol = json.dig(:data, :configurations, :protocol)
        if !protocol.nil?
            if @@protocol_types.include?(protocol)
                @beacon_configuration = build_beacon_configuration(json[:data], protocol)
                begin
                    if @beacon_configuration.save
                        render_beacon_configuration(@beacon_configuration)
                    else
                        render json: { errors: V1::BeaconConfigurationErrorSerializer.serialize(@beacon_configuration.errors)}, status: :unprocessable_entity
                    end
                rescue ActiveRecord::RecordNotUnique => e
                    render json: {errors: [{detail: "configuration already exists", source: {pointer: "data"}}]}, status: :unprocessable_entity
                end
            else
                render json: {errors: [{detail: "has to be of type (#{@@protocol_types.map(&:to_s).join(", ")})", source: {pointer: "/data/attributes/protocol"}}]}, status: :unprocessable_entity
            end
        else
            render json: {errors: [{detail: "can't be blank", source: {pointer: "/data/attributes/protocol"}}]}, status: :unprocessable_entity
        end
    end

    def update
        # we can update name, tags, enabled
        @beacon_configuration = BeaconConfiguration.find_by_id(params[:id])
        if @beacon_configuration
            json = flatten_request({single_record: true})
            if @beacon_configuration.update_attributes(configuration_params(json[:data]))
                render_beacon_configuration(@beacon_configuration)
            else
                render json: { errors: V1::BeaconConfigurationErrorSerializer.serialize(@beacon_configuration.errors)}, status: :unprocessable_entity
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
        convert_param_if_exists(local_params[:configurations], :name, :title)

        # if local_params[:configurations].has_key?(:tags) && local_params[:configurations][:tags].nil?
        #     local_params[:configurations][:tags] = []
        # end

        local_params.fetch(:configurations, {}).permit(:title, {tags: []}, :enabled, :location_id)
    end

    def filter_params
        convert_param_if_exists(params[:filter], :"location-id", :location_id)
        params.fetch(:filter, {}).permit(:query, :protocol, {:protocols => []}, {:tags => []}, :location_id)
    end

    def query_keyword
        filter_params.fetch(:query, nil)
    end

    def query_tags
        @query_tags ||= filter_params.fetch(:tags, [])
    end

    def query_location_id
        @query_location_id ||= filter_params[:location_id]
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

    def beacon_configuration_params(local_params)
        convert_param_if_exists(local_params[:configurations], :name, :title)
        local_params.fetch(:configurations, {}).permit(:title, :enabled, {tags: []}, :location_id)
    end

    def ibeacon_configuration_params(local_params)
        convert_param_if_exists(local_params[:configurations], :major_number, :major)
        convert_param_if_exists(local_params[:configurations], :minor_number, :minor)
        local_params.fetch(:configurations, {}).permit(:uuid, :major, :minor)
    end

    def eddystone_namespace_configuration_params(local_params)
        local_params.fetch(:configurations, {}).permit(:namespace, :instance_id)
    end

    def url_configuration_params(local_params)
        local_params.fetch(:configurations, {}).permit(:url)
    end

    def build_beacon_configuration(local_params, protocol)
        beacon_opts = beacon_configuration_params(local_params)
        case protocol
        when IBeaconConfiguration.protocol
            opts = beacon_opts.merge(ibeacon_configuration_params(local_params)).merge(account_id: current_account.id)
            beacon_configuration = IBeaconConfiguration.new(opts)

        when EddystoneNamespaceConfiguration.protocol
            opts = beacon_opts.merge(eddystone_namespace_configuration_params(local_params)).merge(account_id: current_account.id)
            beacon_configuration = EddystoneNamespaceConfiguration.new(opts)

        when UrlConfiguration.protocol
            opts = beacon_opts.merge(url_configuration_params(local_params)).merge(account_id: current_account.id)
            beacon_configuration = UrlConfiguration.new(opts)
        else
            nil
        end
    end

    def render_beacon_configuration(beacon_configuration)
        if beacon_configuration
            json = {
                "data" => serialize_beacon_configuration(beacon_configuration, {protocol: beacon_configuration.protocol})
            }
            should_include = ["location", "devices"] #whitelist_include(["location", "devices"])

            if should_include.include?("devices")
                devices = beacon_configuration.beacon_devices.all.to_a
                json["data"]["relationships"] = {} if json["data"]["relationships"].nil?
                json["data"]["relationships"].merge!(
                    {
                        "devices" => {
                            "data" => devices.map do |device|
                                {"type" => device.model_type, "id" => device.id.to_s}
                            end
                        }
                    }
                )
                json["included"] = [] if json["included"].nil?
                json["included"] += devices.map{|device| serialize_device(device)}
            end

            if should_include.include?("location") && beacon_configuration.location
                json["data"]["relationships"] = {} if json["data"]["relationships"].nil?
                json["data"]["relationships"].merge!(
                    {
                        "location" => {
                            "data" => {"type" => "locations", "id" => beacon_configuration.location.id.to_s}
                        }
                    }
                )
                included = serialize_location(beacon_configuration.location)

                json["included"] = [] if json["included"].nil?
                json["included"] += [included]
            end

            render json: json
        else
            head :not_found
        end
    end

    def serialize_location(location)
        {
            "type" => "locations",
            "id" => location.id,
            "attributes" => {
                "name" => location.title,
                "address" => location.address,
                "city" => location.city,
                "province" => location.province,
                "country" => location.country,
                "latitude" => location.latitude,
                "longitude" => location.longitude,
                "radius" => location.radius,
                "tags" => location.tags,
                "enabled" => location.enabled,
                "shared" => location.shared
            }
        }
    end

    def serialize_partial_location(location)
        {
            "type" => "locations",
            "id" => location.id,
            "attributes" => {
                "name" => location.name
            }
        }
    end

    def elasticsearch_serialize_beacon(config, include_location = false, extra_attributes = {})
        source = config._source
        json = {
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
        if include_location && !source.location.empty?
            json["relationships"] = {
                "location" => {
                    "data" => { "type" =>  "locations", "id" => source.location.id }
                }
            }
        end
        return json
    end

    def elasticsearch_serialize_ibeacon(config, include_location = false)
        source = config._source
        elasticsearch_serialize_beacon(
            config,
            include_location,
            {
                "protocol" => IBeaconConfiguration.protocol,
                "uuid" => source.uuid,
                "major-number" => source.major,
                "minor-number" => source.minor,
            }
        )
    end

    def elasticsearch_serialize_eddystone_namespace(config, include_location = false)
        source = config._source
        elasticsearch_serialize_beacon(
            config,
            include_location,
            {

                "protocol" => EddystoneNamespaceConfiguration.protocol,
                "namespace" => source.namespace,
                "instance-id" => source.instance_id

            }
        )
    end

    def elasticsearch_serialize_url(config, include_location = false)
        source = config._source
        elasticsearch_serialize_beacon(
            config,
            include_location,
            {
                "protocol" => UrlConfiguration.protocol,
                "url" => source.url
            }
        )
    end


    def serialize_beacon_configuration(beacon_configuration, extra_attributes = {})
        {
            "type" => "configurations",
            "id" => beacon_configuration.id.to_s,
            "attributes" => {
                "name" => beacon_configuration.title,
                "tags" => beacon_configuration.tags,
                "shared" => beacon_configuration.shared,
                "enabled" => beacon_configuration.enabled
            }.merge(extra_attributes).merge(beacon_configuration.configuration_attributes)
        }
    end

    def serialize_device(device)
        {
            "type" => device.model_type,
            "id" => device.id.to_s,
            "attributes" => device.device_attributes.merge(device.configuration_attributes)
        }
    end

    # def serialize_estimote_relationships(estimote_devices)
    #     "data" => estimote_devices.map{|device| {type: "estimote-devices", id: device.id.to_s}}
    # end

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
