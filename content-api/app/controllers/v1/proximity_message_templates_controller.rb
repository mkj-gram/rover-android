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

        message_templates = elasticsearch_query.per_page([page_size, 50].min).page(current_page).records

        records = message_templates.includes(:customer_segment).to_a

        included = []

        filter_place_ids = records.map(&:filter_place_ids).flatten.uniq.compact
        filter_beacon_configuration_ids = records.map(&:filter_beacon_configuration_ids).flatten.uniq.compact
        filter_gimbal_place_ids = records.map(&:filter_gimbal_place_ids).flatten.uniq.compact
        filter_xenio_zone_ids = records.map(&:filter_xenio_zone_ids).flatten.uniq.compact
        filter_xenio_place_ids = records.map(&:filter_xenio_place_ids).flatten.uniq.compact
        experience_ids = records.map(&:experience_id).uniq.compact

        included += Place.where(id: filter_place_ids).all.map{|place| V1::PlaceSerializer.serialize(place)}
        included += BeaconConfiguration.where(id: filter_beacon_configuration_ids).all.map {|beacon_configuration| V1::BeaconConfigurationSerializer.serialize(beacon_configuration)}
        included += GimbalPlace.where(id: filter_gimbal_place_ids).all.map { |gimbal_place| V1::GimbalPlaceSerializer.serialize(gimbal_place) }
        included += Experiences::Experience.find_all(experience_ids).map{|experience| V1::ExperienceSerializer.serialize(experience, nil, current_account.subdomain, {fields: [:name, :"short-url", :"simulator-url"]})}
        included += XenioZone.where(id: filter_xenio_zone_ids).all.map{|zone| V1::XenioZoneSerializer.serialize(zone) }
        included += XenioPlace.where(id: filter_xenio_place_ids).all.map{|place| V1::XenioPlaceSerializer.serialize(place) }
        # Preload all stats into their respective records
        stats = MessageTemplateStats.find_all(records.map(&:id).compact).index_by(&:id)
        experience_stats = ExperienceStats.find_all(records.map(&:experience_id).compact.uniq.map{|i| BSON::ObjectId(i) }).index_by(&:id)
        records.each{|template| template.stats = stats[template.id] }
        records.each{|template| template.experience_stats = experience_stats[template.experience_id] }

        json = {
            "data" => records.map{|message| serialize_message(message)},
            "meta" => {
                "totalRecords" => message_templates.total,
                "totalPages" => message_templates.total_pages,
                "totalDrafts" => current_account.proximity_message_templates_draft_count,
                "totalPublished" => current_account.proximity_message_templates_published_count,
                "totalArchived" => current_account.proximity_message_templates_archived_count
            },
            "included" => included
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
        json = flatten_request({single_record: true, except: "attributes.landing-page"})
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
        convert_param_if_exists(local_params[:proximity_messages], :xenio_zone_tags, :filter_xenio_zone_tags)
        convert_param_if_exists(local_params[:proximity_messages], :xenio_zone_ids, :filter_xenio_zone_ids)
        convert_param_if_exists(local_params[:proximity_messages], :xenio_place_tags, :filter_xenio_place_tags)
        convert_param_if_exists(local_params[:proximity_messages], :xenio_place_ids, :filter_xenio_place_ids)
        convert_param_if_exists(local_params[:proximity_messages], :segment_id, :customer_segment_id)
        convert_param_if_exists(local_params[:proximity_messages], :gimbal_place_ids, :filter_gimbal_place_ids)
        convert_param_if_exists(local_params[:proximity_messages], :"landing-page", :landing_page)

        param_should_be_array(local_params[:proximity_messages], :filter_beacon_configuration_tags)
        param_should_be_array(local_params[:proximity_messages], :filter_place_tags)
        param_should_be_array(local_params[:proximity_messages], :filter_xenio_zone_tags)
        param_should_be_array(local_params[:proximity_messages], :filter_xenio_place_tags)
        param_should_be_array(local_params[:proximity_messages], :limits)

        if local_params[:proximity_messages].has_key?(:trigger_event)
            local_params[:proximity_messages][:trigger_event_id] = Events::Pipeline.event_string_to_event_id(local_params[:proximity_messages][:trigger_event])
        end

        allowed_params = local_params.fetch(:proximity_messages, {}).permit(
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
            {:filter_gimbal_place_ids => []},
            {:filter_xenio_zone_tags => []},
            {:filter_xenio_zone_ids => []},
            {:filter_xenio_place_tags => []},
            {:filter_xenio_place_ids => []},
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
            :deep_link_url,
            :customer_segment_id,
            :experience_id,
            {:limits => [:message_limit, :number_of_minutes, :number_of_hours, :number_of_days]}
        )

        if local_params.fetch(:proximity_messages, {}).has_key?(:landing_page)
            allowed_params.merge!(landing_page: local_params[:proximity_messages][:landing_page])
        end

        if local_params.fetch(:proximity_messages, {}).has_key?(:properties)
            allowed_params.merge!(properties: local_params[:proximity_messages][:properties])
        end
    end

    def render_proximity_message(message)
        should_include = ["beacons", "places", "segment", "gimbal-places", "xenio-zones", "xenio-places", "experience"] # when ember can implement include on get whitelist_include(["beacons", "places"])



        extra_attributes = {:"targeted-configurations-count" => message.targeted_beacon_configurations_count}


        json = {
            data: serialize_message(message, extra_attributes),
            meta: {
                totalConfigurationsCount: current_account.searchable_beacon_configurations_count # use searchable since we could be targeting shared beacons
            }
        }

        included = []

        if should_include.include?("beacons") && message.filter_beacon_configuration_ids.any?
            beacon_configurations = message.filter_beacon_configurations
            included += beacon_configurations.map{|configuration| V1::BeaconConfigurationSerializer.serialize(configuration)}
        end

        if should_include.include?("places") && message.filter_place_ids.any?
            places = message.filter_places
            included += places.map{|place| V1::PlaceSerializer.serialize(place)}
        end

        if should_include.include?("segment") && message.customer_segment
            message.customer_segment.account = current_account
            included += [V1::CustomerSegmentSerializer.serialize(message.customer_segment)]
        end

        if should_include.include?("gimbal-places") && message.gimbal_places
            included += message.gimbal_places.map{|gimbal_place| V1::GimbalPlaceSerializer.serialize(gimbal_place)}
        end

        if should_include.include?("xenio-zones") && message.xenio_zones
            included += message.xenio_zones.map{|xenio_zone| V1::XenioZoneSerializer.serialize(xenio_zone) }
        end

        if should_include.include?("xenio-places") && message.xenio_places
            included += message.xenio_places.map{|xenio_place| V1::XenioPlaceSerializer.serialize(xenio_place) }
        end

        if should_include.include?("experience") && message.experience_id
            experience = Experiences::Experience.find(message.experience_id)
            included += [ V1::ExperienceSerializer.serialize(experience, nil, current_account.subdomain, {fields: [:name, :"short-url", :"simulator-url" ]})] if experience
        end

        if included.any?
            json[:included] = included
        end

        return json
    end

    def set_proximity_message
        @proximity_message = ProximityMessageTemplate.find_by_id(params[:id])
        head :not_found and return if @proximity_message.nil?
        head :forbidden and return if @proximity_message.account_id != current_account.id
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
        message.customer_segment.account = current_account if message.customer_segment
        json = {
            type: "proximity-messages",
            id: message.id.to_s,
            attributes: {
                name: message.title,
                :"notification-text" => message.notification_text,
                published: message.published,
                archived: message.archived,
                :"trigger-event" => Events::Pipeline.event_id_to_event_string(message.trigger_event_id),
                :"configuration-tags" => message.filter_beacon_configuration_tags,
                :"xenio-zone-tags" => message.filter_xenio_zone_tags,
                :"xenio-place-tags" => message.filter_xenio_place_tags,
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
                :"limits" => message.limits.map{|limit| V1::MessageLimitSerializer.serialize(limit)},
                :"save-to-inbox" => message.save_to_inbox,
                :"content-type" => message.content_type,
                :"website-url" => message.website_url,
                :"deep-link-url" => message.deeplink_url,
                :"approximate-customers-count" => message.approximate_customers_count,
                :"total-delivered" => message.stats.total_delivered,
                :"total-notification-opens" => message.stats.total_notification_opens,
                :"total-inbox-opens" => message.stats.total_inbox_opens,
                :"total-opens" => message.stats.total_opens,
                :"unique-opens" => message.stats.unique_opens,
                :"total-notifications-sent" => message.stats.total_notifications_sent,
                :"total-notifications-failed" => message.stats.total_notifications_failed,
                :"total-experience-opens" => message.experience_stats.total_opens,
                :"landing-page" => message.landing_page.as_json(dasherize: true),
                :"properties" => message.properties,
            }.merge(extra_attributes),
            relationships: {}
        }

        if message.filter_beacon_configuration_ids.any?
            json[:relationships].merge!(
                {
                    configurations: {
                        data: message.filter_beacon_configuration_ids.map{|beacon_id| {type: "configurations", id: beacon_id}}
                    }
                }
            )
        end

        if message.filter_place_ids.any?
            json[:relationships].merge!(
                {
                    places: {
                        data: message.filter_place_ids.map{|place_id| {type: "places", id: place_id}}
                    }
                }
            )
        end

        if message.filter_xenio_zone_ids.any?
            json[:relationships].merge!(
                {
                    :"xenio-zones" => {
                        data: message.filter_xenio_zone_ids.map{|zone_id| {type: "xenio-zones", id: zone_id }}
                    }
                }
            )
        end

        if message.filter_xenio_place_ids.any?
            json[:relationships].merge!(
                {
                    :"xenio-places" => {
                        data: message.filter_xenio_place_ids.map{|place_id| {type: "xenio-places", id: place_id }}
                    }
                }
            )
        end

        if message.filter_gimbal_place_ids.any?
            json[:relationships].merge!(
                {
                    :"gimbal-places" => {
                        data: message.filter_gimbal_place_ids.map{|gimbal_place_id| { type: "gimbal-places", id: gimbal_place_id.to_s }}
                    }
                }
            )
        end

        if message.customer_segment_id
            json[:relationships].merge!(
                {
                    :"segment" => {
                        data: { type: "segments", id: message.customer_segment_id.to_s }
                    }

                }
            )
        end

        if message.experience_id
            json[:relationships].merge!(
                {
                    :"experience" => {
                        data: { type: "experiences", id: message.experience_id }
                    }
                }
            )
        end

        return json

    end

    def serialize_limit(limit)
        {
            :"message-limit" => limit.message_limit,
            :"number-of-minutes" => limit.number_of_minutes
        }
    end

end