class V1::ScheduledMessageTemplatesController < V1::ApplicationController

    before_action :authenticate
    before_action :validate_json_schema,    only: [:create, :update]
    before_action :check_access,            only: [:index, :show, :create, :update, :destroy]
    before_action :set_scheduled_message,   only: [:show, :update, :destroy, :test_message]

    def index
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

        must_filter += query_collection_type if query_collection_type

        query = {
            query: {
                filtered: {
                    query: { match_all: {} },
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

        elasticsearch_query = ScheduledMessageTemplate.search(query)

        message_templates = elasticsearch_query.per_page([page_size,50].min).page(current_page).records

        records = message_templates.includes(:customer_segment).to_a
        # next grab all stats
        stats = MessageTemplateStats.find_all(records.map(&:id).compact).index_by(&:id)
        records.each{|template| template.stats = stats[template.id] }

        experience_ids = records.map(&:experience_id).uniq.compact
        included = []

        included += records.map(&:customer_segment).compact.uniq.map { |segment| V1::CustomerSegmentSerializer.serialize(segment) }
        included += Experiences::Experience.find_all(experience_ids).map{|experience| V1::ExperienceSerializer.serialize(experience, nil, {fields: [:name, :"short-url"]})}

        json = {
            "data" => records.map{ |message| serialize_message(message)},
            "meta" => {
                "totalRecords" => message_templates.total,
                "totalPages" => message_templates.total_pages,
                "totalDrafts" => current_account.scheduled_message_templates_draft_count,
                "totalScheduled" => current_account.scheduled_message_templates_published_count,
                "totalArchived" => current_account.proximity_message_templates_archived_count,
                "totalSent" => current_account.scheduled_message_templates_sent_count
            },
            "included" => included
        }

        render json: json
    end

    def show
        json = render_scheduled_message(@scheduled_message)

        render json: json
    end

    def create
        json = flatten_request({single_record: true, except: "attributes.landing-page"})

        @scheduled_message = current_account.scheduled_message_templates.build(scheduled_message_params(json[:data]))

        if @scheduled_message.save
            json = render_scheduled_message(@scheduled_message)
            render json: json
        else
            render json: { errors: V1::ScheduledMessageTemplateErrorSerializer.serialize(@scheduled_message.errors)}, status: :unprocessable_entity
        end

    end

    def update
        json = flatten_request({single_record: true, except: "attributes.landing-page"})
        if @scheduled_message.update_attributes(scheduled_message_params(json[:data]))
            json = render_scheduled_message(@scheduled_message)
            render json: json
        else
            render json: { errors: V1::ScheduledMessageTemplateErrorSerializer.serialize(@scheduled_message.errors)}, status: :unprocessable_entity
        end
    end

    def destroy
        if @scheduled_message.destroy
            head :no_content
        else
            render json: { errors: V1::ScheduledMessageTemplateErrorSerializer.serialize(@scheduled_message.errors)}, status: :unprocessable_entity
        end
    end

    def test_message
        param_should_be_array(params, :customer_ids)
        customer_ids = params[:customer_ids]
        if customer_ids.any?
            SendMessageWorker.perform_async(@scheduled_message.id, {} , customer_ids)
            head :ok
        else
            head :bad_request
        end
    end

    def resource
        ScheduledMessageTemplate
    end


    private

    def scheduled_message_params(local_params)
        convert_param_if_exists(local_params[:scheduled_messages], :name, :title)
        convert_param_if_exists(local_params[:scheduled_messages], :segment_id, :customer_segment_id)
        convert_param_if_exists(local_params[:scheduled_messages], :"landing-page", :landing_page)
        
        allowed_params = local_params.fetch(:scheduled_messages, {}).permit(
            :title,
            :notification_text,
            :published,
            :archived,
            :save_to_inbox,
            :content_type,
            :website_url,
            :deep_link_url,
            :customer_segment_id,
            :use_local_time_zone,
            :scheduled_time_zone,
            :scheduled_timestamp,
            :experience_id
        )

        if local_params.fetch(:scheduled_messages, {}).has_key?(:landing_page)
            allowed_params.merge!(landing_page: local_params[:scheduled_messages][:landing_page])
        end

        if local_params.fetch(:scheduled_messages, {}).has_key?(:properties)
            allowed_params.merge!(properties: local_params[:scheduled_messages][:properties])
        end

    end


    def render_scheduled_message(message)
        should_include = ["segment", "experience"]

        json = {
            data: serialize_message(message)
        }

        included = []

        if should_include.include?("segment") &&  message.customer_segment
           included += [V1::CustomerSegmentSerializer.serialize(message.customer_segment)]
        end

        if should_include.include?("experience") && message.experience_id
            experience = Experiences::Experience.find(message.experience_id)
            included += [ V1::ExperienceSerializer.serialize(experience, nil, {fields: [:name, :"short-url" ]})] if experience
        end

        if included.any?
            json[:included] = included
        end

        return json
    end

    def query_collection_type
        type = params.dig(:filter, :collectionType)
        case type
        when "drafts"
            [
                {
                    term: {
                        archived: false
                    }
                },
                {
                    term: {
                        published: false
                    }
                },
                {
                    term: {
                        sent: false
                    }
                }
            ]
        when "scheduled"
            [
                {
                    term: {
                        archived: false
                    }
                },
                {
                    term: {
                        published: true
                    }
                },
                {
                    term: {
                        sent: false
                    }
                }
            ]
        when "sent"
            [
                {
                    term: {
                        archived: false
                    }
                },
                {
                    term: {
                        published: true
                    }
                },
                {
                    term: {
                        sent: true
                    }
                }
            ]
        when "archived"
            [
                {
                    term: {
                        archived: true
                    }
                }
            ]
        else
            nil
        end
    end


    def set_scheduled_message
        @scheduled_message = ScheduledMessageTemplate.find_by_id(params[:id])
        head :not_found and return if @scheduled_message.nil?
        head :forbidden and return if @scheduled_message.account_id != current_account.id 
    end


    def serialize_message(message, extra_attributes = {})
        message.account = current_account
        message.customer_segment.account = current_account if message.customer_segment
        json = {
            type: "scheduled-messages",
            id: message.id.to_s,
            attributes: {
                name: message.title,
                :"notification-text" => message.notification_text,
                published: message.published,
                archived: message.archived,
                sent: message.sent,
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
                :"landing-page" => message.landing_page.as_json(dasherize: true),
                :"properties" => message.properties,
                :"scheduled-timestamp" => message.scheduled_timestamp,
                :"use-local-time-zone" => message.use_local_time_zone,
                :"scheduled-time-zone" => message.scheduled_time_zone
            }.merge(extra_attributes),
            relationships: {}
        }

        if message.customer_segment_id
            json[:relationships].merge!({
                segment: {
                    data: { type: "segments", id: message.customer_segment_id.to_s }
                }
            })
        end

        if message.experience_id
            json[:relationships].merge!({
                experience: {
                    data: { type: "experiences".freeze, id: message.experience_id }
                }
            })
        end

        return json
    end

end
