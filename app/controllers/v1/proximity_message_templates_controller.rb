class V1::ProximityMessageTemplatesController < V1::ApplicationController

    before_action :authenticate
    before_action :validate_json_schema,    only: [:create, :update]
    before_action :check_access,            only: [:index, :show, :create, :update, :destroy]
    before_action :set_proximity_message,   only: [:show, :update, :destroy, :test_message]


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

        if !query_published.nil?
            must_filter.push(
                {
                    term: {
                        published: query_published
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

        elasticsearch_query = ProximityMessageTemplate.search(query)

        message_templates = elasticsearch_query.per_page(page_size).page(current_page).records

        records = message_templates.includes(:customer_segment).to_a
        # next grab all stats
        stats = MessageTemplateStats.find_all(records.map(&:id).compact).index_by(&:id)
        records.each{|template| template.stats = stats[template.id] }

        json = {
            "data" => records.map{|message| serialize_message(message)},
            "meta" => {
                "totalRecords" => message_templates.total,
                "totalPages" => message_templates.total_pages,
                "totalDrafts" => current_account.proximity_message_templates_draft_count,
                "totalPublished" => current_account.proximity_message_templates_published_count,
                "totalArchived" => current_account.proximity_message_templates_archived_count
            }
        }

        render json: json
    end

    def show
        # include beacons
        # include place

        json = render_proximity_message(@proximity_message)

        render json: json
    end

    # create accepts everything the same as update
    def create
        json = flatten_request({single_record: true, except: "attributes.landing-page"})

        @proximity_message = current_account.proximity_message_templates.build(proximity_message_params(json[:data]))

        if @proximity_message.save
            json = render_proximity_message(@proximity_message)
            render json: json
        else
            render json: { errors: V1::ProximityMessageTemplateErrorSerializer.serialize(@proximity_message.errors)}, status: :unprocessable_entity
        end

    end

    def update
        json = flatten_request({single_record: true})
        if @proximity_message.update_attributes(proximity_message_params(json[:data]))
            json = render_proximity_message(@proximity_message)
            render json: json
        else
            render json: { errors: V1::ProximityMessageTemplateErrorSerializer.serialize(@proximity_message.errors)}, status: :unprocessable_entity
        end
    end

    def destroy
        if @proximity_message.destroy
            head :no_content
        else
            render json: { errors: V1::ProximityMessageTemplateErrorSerializer.serialize(@proximity_message.errors)}, status: :unprocessable_entity
        end
    end

    def test_message
        # this will just be simple ids
        # customer_ids = []
        param_should_be_array(params, :customer_ids)
        customer_ids = params[:customer_ids]
        if customer_ids.any?
            SendMessageWorker.perform_async(@proximity_message.id, {} , customer_ids)
            head :ok
        else
            head :bad_request
        end
    end


    def resource
        ProximityMessageTemplate
    end

    private

    def proximity_message_params(local_params)
        convert_param_if_exists(local_params[:proximity_messages], :name, :title)
        convert_param_if_exists(local_params[:proximity_messages], :configuration_tags, :filter_beacon_configuration_tags)
        convert_param_if_exists(local_params[:proximity_messages], :configuration_ids, :filter_beacon_configuration_ids)
        convert_param_if_exists(local_params[:proximity_messages], :place_tags, :filter_place_tags)
        convert_param_if_exists(local_params[:proximity_messages], :place_ids, :filter_place_ids)
        convert_param_if_exists(local_params[:proximity_messages], :segment_id, :customer_segment_id)
        convert_param_if_exists(local_params[:proximity_messages], :gimbal_place_id, :filter_gimbal_place_id)
        param_should_be_array(local_params[:proximity_messages], :filter_beacon_configuration_tags)
        param_should_be_array(local_params[:proximity_messages], :filter_place_tags)
        param_should_be_array(local_params[:proximity_messages], :limits)

        if local_params[:proximity_messages].has_key?(:trigger_event)
            local_params[:proximity_messages][:trigger_event_id] = Events::Pipeline.event_string_to_event_id(local_params[:proximity_messages][:trigger_event])
        end

        local_params.fetch(:proximity_messages, {}).permit(
            :title,
            :notification_text,
            :published,
            :archived,
            :save_to_inbox,
            :trigger_event_id,
            {:filter_beacon_configuration_tags => []},
            {:filter_beacon_configuration_ids => []},
            {:filter_place_tags => []},
            {:filter_place_ids => []},
            :filter_gimbal_place_id,
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
            :content_type,
            :website_url,
            :customer_segment_id,
            {:limits => [:message_limit, :number_of_minutes, :number_of_hours, :number_of_days]}
        ).merge({:landing_page => local_params.dig(:proximity_messages, :landing_page), :properties => local_params.dig(:proximity_messages, :properties)})
    end

    def render_proximity_message(message)
        should_include = ["beacons", "places", "segment"] # when ember can implement include on get whitelist_include(["beacons", "places"])



        extra_attributes = {:"targeted-configurations-count" => message.targeted_beacon_configurations_count}


        json = {
            data: serialize_message(message, extra_attributes),
            meta: {
                totalConfigurationsCount: current_account.searchable_beacon_configurations_count # use searchable since we could be targeting shared beacons
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

        if should_include.include?("places")
            json[:data][:relationships] = {} if json[:data][:relationships].nil?
            if message.filter_place_ids

                json[:data][:relationships].merge!(
                    {
                        places: {
                            data: message.filter_place_ids.map{|place_id| {type: "places", id: place_id}}
                        }
                    }
                )
                places = message.filter_places
                included += places.map{|place| V1::PlaceSerializer.serialize(place)}
            else
                json[:data][:relationships].merge!({places: {data: []}})
            end
        end

        if should_include.include?("segment")
            json[:data][:relationships] = {} if json[:data][:relationships].nil?
            if message.customer_segment
                json[:data][:relationships].merge!(
                    {
                        :"segment" => {
                            data: { type: "segments", id: message.customer_segment.id.to_s }
                        }

                    }
                )
                included += [V1::CustomerSegmentSerializer.serialize(message.customer_segment)]
            else
                json[:data][:relationships].merge!({:"segment" => {data: nil}})
            end
        end

        if included.any?
            json[:included] = included
        end

        return json
    end

    def set_proximity_message
        @proximity_message = ProximityMessageTemplate.find_by_id(params[:id])
        head :not_found if @proximity_message.nil?
    end

    def query_archived
        query = params.dig(:filter, :archived)
        return query.nil? ? nil : query.to_s.to_bool
    end

    def query_published
        query = params.dig(:filter, :published)
        return query.nil? ? nil : query.to_s.to_bool
    end

    def serialize_message(message, extra_attributes = {})
        # extra_attributes.merge!(:landing_page_template => message.landing_page_template.to_json) if message.landing_page_template
        message.account = current_account
        {
            type: "proximity-messages",
            id: message.id.to_s,
            attributes: {
                name: message.title,
                :"notification-text" => message.notification_text,
                published: message.published,
                archived: message.archived,
                :"trigger-event" => Events::Pipeline.event_id_to_event_string(message.trigger_event_id),
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
                :"place-tags" => message.filter_place_tags,
                :"gimbal-place-id" => message.filter_gimbal_place_id,
                :"limits" => message.limits.map{|limit| V1::MessageLimitSerializer.serialize(limit)},
                :"save-to-inbox" => message.save_to_inbox,
                :"content-type" => message.content_type,
                :"website-url" => message.website_url,
                :"approximate-customers-count" => message.approximate_customers_count,
                :"total-delivered" => message.stats.total_delivered,
                :"total-notification-opens" => message.stats.total_notification_opens,
                :"total-inbox-opens" => message.stats.total_inbox_opens,
                :"total-opens" => message.stats.total_opens,
                :"unique-opens" => message.stats.unique_opens,
                :"landing-page" => message.landing_page.as_json(dasherize: true)
            }.merge(extra_attributes)
        }
    end

    def serialize_limit(limit)
        {
            :"message-limit" => limit.message_limit,
            :"number-of-minutes" => limit.number_of_minutes
        }
    end

end
