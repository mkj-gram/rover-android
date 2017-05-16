class V1::BeaconConfigurationsController < V1::ApplicationController

    before_action :authenticate
    before_action :validate_json_schema,    only: [:create, :update]
    before_action :set_resource,            only: [:show, :update, :destroy]
    before_action :check_access,            only: [:index, :show, :create, :update, :destroy]

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
            query_tags.each do |tag|
                must_filter.push(
                    {
                        term:  {
                            tags: tag,
                        }
                    }
                )
            end
        end

        if query_place_id
            must_filter.push(
                {
                    term: {
                        "place.id" => query_place_id.to_i
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
                fields: ["_id", "devices_meta.type", "devices_meta.count"],
                query: {
                    filtered: {
                        query: {
                            match_all: {}
                        },
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
                fields: ["_id", "devices_meta.type", "devices_meta.count"],
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
        records = BeaconConfiguration.where(id: results.map(&:_id)).includes(:place)
        device_meta_index = results.inject({}) do |hash, r|
            if r.has_key?(:fields) && r.fields.has_key?("devices_meta.type")
                hash.merge!(
                    r._id.to_i => {
                        "beacon-type": r.fields["devices_meta.type"].first,
                        "beacon-count": r.fields.has_key?("devices_meta.count") ? r.fields["devices_meta.count"].first || 0 : 0
                    }
                )
                hash
            else
                hash
            end
        end
        include_place = true #whitelist_include(["place"]).first == "place"
        json  = {
            "data" => records.map do |config|
                device_meta = device_meta_index[config.id] || { "beacon-type": nil, "beacon-count" => nil }
                json = V1::BeaconConfigurationSerializer.serialize(config, device_meta)
                if config.place
                    json["relationships"] = {
                        "place" => {
                            "data" => { type: "places", id: config.place.id.to_s }
                        }
                    }
                end
                json
            end,
            "meta" => {
                "totalRecords" => results.total,
                "totalPages" => results.total_pages
            }
        }

        if query_place_id
            json["meta"]["totalSearchableRecords"] = BeaconConfiguration.where(place_id: query_place_id).count
        else
            json["meta"]["totalSearchableRecords"] = current_account.searchable_beacon_configurations_count
        end

        included = []

        if whitelist_include(["place"])
            included += records.map(&:place).compact.uniq.map{ |place| V1::PlaceSerializer.serialize(place) }
        end

        if included.any?
            json["included"] = included
        end

        render json: json
    end

    def show
        # show a detail view of the beacon
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
        json = flatten_request({single_record: true})
        if @beacon_configuration.update_attributes(beacon_configuration_params(json[:data]))
            render_beacon_configuration(@beacon_configuration)
        else
            render json: { errors: V1::BeaconConfigurationErrorSerializer.serialize(@beacon_configuration.errors)}, status: :unprocessable_entity
        end

    end

    def destroy
        @beacon_configuration.destroy
        head :no_content
    end

    def resource
        BeaconConfiguration
    end

    private

    def set_resource
        @beacon_configuration = current_account.beacon_configurations.find_by_id(params[:id])
        head :not_found if @beacon_configuration.nil?
    end

    def filter_params
        convert_param_if_exists(params[:filter], :"place-id", :place_id)
        params.fetch(:filter, {}).permit(:query, :protocol, {:protocols => []}, {:tags => []}, :place_id)
    end

    def query_keyword
        filter_params.fetch(:query, nil)
    end

    def query_tags
        @query_tags ||= filter_params.fetch(:tags, [])
    end

    def query_place_id
        @query_place_id ||= filter_params[:place_id]
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
        param_should_be_array(local_params[:configurations], :tags)
        local_params.fetch(:configurations, {}).permit(:title, :enabled, :tags, {tags: []}, :place_id, :indoor_level)
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
                "data" => V1::BeaconConfigurationSerializer.serialize(beacon_configuration)
            }
            should_include = ["place", "beacons"] #whitelist_include(["place", "beacons"])

            if should_include.include?("beacons")
                devices = beacon_configuration.beacon_devices.all.to_a
                json["data"]["relationships"] = {} if json["data"]["relationships"].nil?
                json["data"]["relationships"].merge!(
                    {
                        "beacons" => {
                            "data" => devices.map do |device|
                                {"type" => device.model_type, "id" => device.id.to_s}
                            end
                        }
                    }
                )
                json["included"] = [] if json["included"].nil?
                json["included"] += devices.map{|device| serialize_device(device)}
            end

            if should_include.include?("place") && beacon_configuration.place
                json["data"]["relationships"] = {} if json["data"]["relationships"].nil?
                json["data"]["relationships"].merge!(
                    {
                        "place" => {
                            "data" => {"type" => "places", "id" => beacon_configuration.place.id.to_s}
                        }
                    }
                )
                included = serialize_place(beacon_configuration.place)

                json["included"] = [] if json["included"].nil?
                json["included"] += [included]
            end

            render json: json
        else
            head :not_found
        end
    end

    def serialize_place(place)
        {
            "type" => "places",
            "id" => place.id,
            "attributes" => {
                "name" => place.title,
                "address" => place.address,
                "city" => place.city,
                "province" => place.province,
                "country" => place.country,
                "latitude" => place.latitude,
                "longitude" => place.longitude,
                "radius" => place.radius,
                "tags" => place.tags,
                "enabled" => place.enabled,
                "shared" => place.shared
            }
        }
    end

    def serialize_partial_place(place)
        {
            "type" => "places",
            "id" => place.id,
            "attributes" => {
                "name" => place.name
            }
        }
    end

    def elasticsearch_serialize_beacon(config, include_place = false, extra_attributes = {})
        source = config._source
        json = {
            "type" => "configurations",
            "id" => config._id,
            "attributes" => {
                "name" => source.title,
                "tags" => source.tags,
                "shared" => source.shared,
                "enabled" => source.enabled,
                "beacon-type" => source.devices_meta[:type],
                "beacon-count" => source.devices_meta[:count] || 0
            }.merge(extra_attributes)
        }
        if include_place && !source.place.empty?
            json["relationships"] = {
                "place" => {
                    "data" => { "type" =>  "places", "id" => source.place.id }
                }
            }
        end
        return json
    end

    def elasticsearch_serialize_ibeacon(config, include_place = false)
        source = config._source
        elasticsearch_serialize_beacon(
            config,
            include_place,
            {
                "protocol" => IBeaconConfiguration.protocol,
                "uuid" => source.uuid,
                "major-number" => source.major,
                "minor-number" => source.minor,
            }
        )
    end

    def elasticsearch_serialize_eddystone_namespace(config, include_place = false)
        source = config._source
        elasticsearch_serialize_beacon(
            config,
            include_place,
            {

                "protocol" => EddystoneNamespaceConfiguration.protocol,
                "namespace" => source.namespace,
                "instance-id" => source.instance_id

            }
        )
    end

    def elasticsearch_serialize_url(config, include_place = false)
        source = config._source
        elasticsearch_serialize_beacon(
            config,
            include_place,
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
            "attributes" => device.device_attributes
        }.dasherize
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
