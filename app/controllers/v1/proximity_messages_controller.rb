class V1::ProximityMessagesController < V1::ApplicationController
    before_action :authenticate
    before_action :validate_json_schema, only: [:create, :update]
    before_action :set_proximity_message, only: [:show, :update, :destroy]
    def index
        # list all proximity messages
        # queryby status?
        # query_status = archived=true published=true
        should_query = []
        should_filter = []
        must_filter = []

        # grab all messages which belong to the current account
        must_filter.push(
            {
                term: {
                    account_id: current_account.id
                }
            }
        )

        if !query_archived.nil?
            must_filter.push(
                {
                    term: {
                        archived: query_archived
                    }
                }
            )
        end



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

        messages = Elasticsearch::Model.search(query, [ProximityMessage])
        results = messages.per_page(page_size).page(current_page).results

        if query_archived == true
            total_searchable_records = current_account.archived_proximity_messages_count
        elsif query_archived == false
            total_searchable_records = current_account.proximity_messages_count - current_account.archived_proximity_messages_count
        else
            total_searchable_records = current_account.proximity_messages_count
        end

        json = {
            "data" => results.map{|message| serialize_elasticsearch_message(message)},
            "meta" => {
                "totalRecords" => results.total,
                "totalPages" => results.total_pages,
                "totalSearchableRecords" => total_searchable_records
            }
        }

        render json: json
    end

    def show
        # include beacons
        # include location

        json = render_proximity_message(@proximity_message)

        render json: json
    end

    # create accepts everything the same as update
    def create
        json = flatten_request({single_record: true})
        @proximity_message = ProximityMessage.new(proximity_message_params(json[:data]))
        @proximity_message.account_id = current_account.id
        if @proximity_message.save
            json = render_proximity_message(@proximity_message)
            render json: json
        else
            render json: { errors: V1::ProximityMessageErrorSerializer.serialize(@proximity_message.errors)}, status: :unprocessable_entity
        end
    end

    def update
        json = flatten_request({single_record: true})
        if @proximity_message.update_attributes(proximity_message_params(json[:data]))
            json = render_proximity_message(@proximity_message)
            render json: json
        else
            render json: { errors: V1::ProximityMessageErrorSerializer.serialize(@proximity_message.errors)}, status: :unprocessable_entity
        end
    end

    def destroy
        if @proximity_message.destroy
            head :no_content
        else
            render json: { errors: V1::ProximityMessageErrorSerializer.serialize(@proximity_message.errors)}, status: :unprocessable_entity
        end
    end

    private

    def proximity_message_params(local_params)
        convert_param_if_exists(local_params[:proximity_messages], :name, :title)
        convert_param_if_exists(local_params[:proximity_messages], :configuration_tags, :filter_beacon_configuration_tags)
        convert_param_if_exists(local_params[:proximity_messages], :configuration_ids, :filter_beacon_configuration_ids)
        convert_param_if_exists(local_params[:proximity_messages], :location_tags, :filter_location_tags)
        convert_param_if_exists(local_params[:proximity_messages], :location_ids, :filter_location_ids)
        local_params.fetch(:proximity_messages, {}).permit(:title, :notification_text, :published, :archived, {:filter_beacon_configuration_tags => []}, {:filter_beacon_configuration_ids => []},{:filter_location_tags => []}, {:filter_location_ids => []})
    end

    def render_proximity_message(message)
        should_include = ["beacons", "locations"] # when ember can implement include on get whitelist_include(["beacons", "locations"])
        json = {
            data: {
                type: "proximity-messages",
                id: message.id.to_s,
                attributes: {
                    name: message.title,
                    :"notification-text" => message.notification_text,
                    published: message.published,
                    archived: message.archived,
                    :"approximate-customers-count" => message.approximate_customers_count,
                    :"configuration-tags" => message.filter_beacon_configuration_tags,
                    :"location-tags" => message.filter_location_tags,
                }
            }
        }
        included = []
        if should_include.include?("beacons")
            json[:data][:relationships] = {} if json[:data][:relationships].nil?
            if message.filter_beacon_configuration_ids
                json[:data][:relationships].merge!(
                    {
                        configurations: {
                            data: message.filter_beacon_configuration_ids.map{|beacon_id| {type: "configurations", id: beacon_id}}
                        }
                    }
                )
                beacon_configurations = message.filter_beacon_configurations
                included += beacon_configurations.map{|configuration| V1::BeaconConfigurationSerializer.serialize(configuration)}
            else
                json[:data][:relationships].merge({beacons: {data: []}})
            end
        end

        if should_include.include?("locations")
            json[:data][:relationships] = {} if json[:data][:relationships].nil?
            if message.filter_location_ids

                json[:data][:relationships].merge!(
                    {
                        locations: {
                            data: message.filter_location_ids.map{|location_id| {type: "locations", id: location_id}}
                        }
                    }
                )
                locations = message.filter_locations
                included += locations.map{|location| V1::LocationSerializer.serialize(location)}
            else
                json[:data][:relationships].merge!({locations: {data: []}})
            end
        end

        if included.any?
            json[:included] = included
        end

        return json
    end

    def set_proximity_message
        @proximity_message = ProximityMessage.find_by_id(params[:id])
        head :not_found if @proximity_message.nil?
    end

    def query_archived
        params.permit(:archived)[:archived].to_s.to_bool
    end


    def serialize_elasticsearch_message(message)
        source = message._source
        {
            type: "proximity-messages",
            id: message.id,
            attributes: {
                name: source.title,
                :"notification-text" => source.notification_text,
                published: source.published,
                archived: source.archived,
                approximate_customers_count: source.approximate_customers_count,
                beacon_configuration_tags: source.filter_beacon_configuration_tags,
                location_configuration_tags: source.filter_location_tags,
            }
        }
    end
end
