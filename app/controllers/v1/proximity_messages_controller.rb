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

        elasticsearch_query = ProximityMessage.search(query)

        messages = elasticsearch_query.per_page(page_size).page(current_page)
        records = messages.records.includes(:customer_segment)
        if query_archived == true
            total_searchable_records = current_account.archived_proximity_messages_count
        elsif query_archived == false
            total_searchable_records = current_account.proximity_messages_count - current_account.archived_proximity_messages_count
        else
            total_searchable_records = current_account.proximity_messages_count
        end

        json = {
            "data" => records.to_a.map{|message| serialize_message(message)},
            "meta" => {
                "totalRecords" => messages.total,
                "totalPages" => messages.total_pages,
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

        param_should_be_array(local_params[:proximity_messages], :filter_beacon_configuration_tags)
        param_should_be_array(local_params[:proximity_messages], :filter_location_tags)
        param_should_be_array(local_params[:proximity_messages], :limits)

        if local_params[:proximity_messages].has_key?(:trigger_event)
            local_params[:proximity_messages][:trigger_event_id] = Event.event_string_to_event_id(local_params[:proximity_messages][:trigger_event])
        end

        local_params.fetch(:proximity_messages, {}).permit(
            :title,
            :notification_text,
            :published,
            :archived,
            :trigger_event_id,
            {:filter_beacon_configuration_tags => []},
            {:filter_beacon_configuration_ids => []},
            {:filter_location_tags => []},
            {:filter_location_ids => []},
            :schedule_start_date,
            :schedule_end_date,
            :schedule_start_time,
            :schedule_end_time,
            :schedule_monday,
            :schedule_tuesday,
            :schedule_wednesday,
            :schedule_thursday,
            :schedule_friday,
            :schedule_saturday,
            :schedule_sunday,
            :segment_id,
            :limits => [:message_limit, :number_of_minutes, :number_of_hours, :number_of_days]
        )
    end

    def render_proximity_message(message)
        should_include = ["beacons", "locations", "segment"] # when ember can implement include on get whitelist_include(["beacons", "locations"])

        json = {
            data: serialize_message(message)
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

        if should_include.included?("segment")
            json[:data][:relationships] = {} if json[:data][:relationships].nil?
            if message.customer_segment
                json[:data][:relationships].merge!(
                    {
                        :"segment" => {
                            data: { type: "segments", id: message.customer_segment.id.to_s }
                        }

                    }
                )
                included += [V1::CustomerSegmentSerializer.serialize(message.customer_segment, {:"total-customers-count" => current_account.customers_count})]
            else
                json[:data][:relationships].merge!({:"customer-segments" => {data: []}})
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
        params.fetch(:filter, {}).fetch(:archived, "false").to_bool
    end

    def serialize_message(message)
        {
            type: "proximity-messages",
            id: message.id.to_s,
            attributes: {
                name: message.title,
                :"notification-text" => message.notification_text,
                published: message.published,
                archived: message.archived,
                :"trigger-event" => Event.event_id_to_event_string(message.trigger_event_id),
                :"configuration-tags" => message.filter_beacon_configuration_tags,
                :"schedule-start-date" => message.schedule_start_date,
                :"schedule-end-date" => message.schedule_end_date,
                :"schedule-start-time" => message.schedule_start_time,
                :"schedule-end-time" => message.schedule_end_time,
                :"schedule-monday" => message.schedule_monday,
                :"schedule-tuesday" => message.schedule_tuesday,
                :"schedule-wednesday" => message.schedule_wednesday,
                :"schedule-thursday" => message.schedule_thursday,
                :"schedule-friday" => message.schedule_friday,
                :"schedule-saturday" => message.schedule_saturday,
                :"schedule-sunday" => message.schedule_sunday,
                :"location-tags" => message.filter_location_tags,
                :"limits" => message.limits.map{|limit| V1::MessageLimitSerializer.serialize(limit)},
                :"approximate-customers-count" => message.customer_segment ? message.customer_segment.approximate_customers_count : current_account.customers_count
            }
        }
    end

    def serialize_limit(limit)
        {
            :"message-limit" => limit.message_limit,
            :"number-of-minutes" => limit.number_of_minutes
        }
    end

end
