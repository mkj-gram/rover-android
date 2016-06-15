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

        if query_archived
            must_filter.push(
                {
                    term: {
                        archived: query_archived
                    }
                }
            )
        end

        if query_sent
            must_filter.push(
                {
                    term: {
                        sent: query_sent
                    }

                }
            )
        end

        if query_published
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

        elasticsearch_query = ScheduledMessageTemplate.search(query)

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
                "totalDrafts" => current_account.scheduled_message_templates_draft_count,
                "totalScheduled" => current_account.scheduled_message_templates_published_count,
                "totalArchived" => current_account.proximity_message_templates_archived_count,
                "totalSent" => current_account.scheduled_message_templates_sent_count
            }
        }

        render json: json
    end

    def show
        json = render_scheduled_message(@scheduled_message)

        render json: json
    end

     def create
        json = flatten_request({single_record: true})

        @scheduled_message = current_account.scheduled_message_templates.build(scheduled_message_params(json[:data]))

        if @scheduled_message.save
            json = render_scheduled_message(@scheduled_message)
            render json: json
        else
            render json: { errors: V1::ScheduledMessageTemplateErrorSerializer.serialize(@scheduled_message.errors)}, status: :unprocessable_entity
        end

    end

    def update
        json = flatten_request({single_record: true})
        if @scheduled_message.update_attributes(scheduled_message_params(json[:data]))
            json = render_proximity_message(@scheduled_message)
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

    def resource
        ScheduledMessageTemplate
    end


    private

    def scheduled_message_params(local_params)
        convert_param_if_exists(local_params[:scheduled_messages], :name, :title)
        convert_param_if_exists(local_params[:scheduled_messages], :segment_id, :customer_segment_id)
        param_should_be_array(local_params[:scheduled_messages], :limits)

        local_params.fetch(:scheduled_messages, {}).permit(
            :title,
            :notification_text,
            :published,
            :archived,
            :save_to_inbox,
            :content_type,
            :website_url,
            :deep_link_url,
            :customer_segment_id,
            :scheduled_at,
            :scheduled_local_time,
            :scheduled_at_time_zone,
            {:limits => [:message_limit, :number_of_minutes, :number_of_hours, :number_of_days]}
        ).merge({:landing_page => local_params.dig(:scheduled_messages, :landing_page), :properties => local_params.dig(:scheduled_messages, :properties)})
    end


    def render_scheduled_message(message)
        should_include = ["segment"]

        json = {
            data: serialize_message(message)
        }

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

    def query_archived
        query = params.dig(:filter, :archived)
        return query.nil? ? nil : query.to_s.to_bool
    end

    def query_sent
        query = params.dig(:filter, :sent)
        return query.nil? ? nil : query.to_s.to_bool
    end

    def query_published
        query = params.dig(:filter, :published)
        return query.nil? ? nil : query.to_s.to_bool
    end

    def set_schedued_message
        @scheduled_message = ScheduledMessageTemplate.find_by_id(params[:id])
        head :not_found if @scheduled_message.nil? || @scheduled_message.account_id != current_account.id
    end


    def serialize_message(message, extra_attributes = {})
        message.account = current_account
        {
            type: "scheduled-messages",
            id: message.id.to_s,
            attributes: {
                name: message.title,
                :"notification-text" => message.notification_text,
                published: message.published,
                archived: message.archived,
                sent: message.sent,
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
                :"landing-page" => message.landing_page.as_json(dasherize: true),
                :"properties" => message.properties,
                :"scheduled-at" => message.scheduled_at,
                :"scheduled-local-time" => message.scheduled_local_time,
                :"scheduled-at-time-zone" => message.scheduled_at_time_zone
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
