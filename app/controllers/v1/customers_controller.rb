class V1::CustomersController < V1::ApplicationController

    before_action :authenticate
    before_action :check_access, only: [:index, :show, :create, :update, :destroy]
    before_action :set_customer, only: [:show]

    def index

        if pagination_type == "cursor"
            index_by_page_cursor
        else
            index_by_page_number
        end

    end

    def show

        included = @customer.devices.map{|device| serialize_device(device)}

        json = {
            data: serialize_customer(@customer),
            included: included
        }

        render json: json
    end

    def resource
        Customer
    end

    private

    def set_customer
        @customer = Customer.find(params[:id])
        head :not_found if @customer.nil?
    end

    def customer_segment_id_query
        params.dig(:filter, :segmentId)
    end

    def render_customer(customer)
    end

    def serialize_customer(customer)
        should_include = ["devices"]

        relationships = {}

        if should_include.include?("devices")
            relationships[:devices] = { data: customer.devices.map { |device| { type: "devices", id: device.id }}}
        end

        V1::CustomerSerializer.serialize(customer).merge(relationships: relationships)
    end


    def serialize_device(device)
        {
            type: "devices",
            id: device.udid.to_s,
            attributes: {
                :"locale-lang" => device.locale_lang,
                :"locale-region" => device.locale_region,
                :"time-zone" => device.time_zone,
                :"sdk-version" => device.sdk_version,
                :"platform" => device.platform,
                :"os-name" => device.os_name,
                :"os-version" => device.os_version,
                :"model" => device.model,
                :"manufacturer" => device.manufacturer,
                :"carrier" => device.manufacturer,
                :"notifications-enabled" => device.notifications_enabled,
                :"location-monitoring-enabled" => device.location_monitoring_enabled,
                :"background-enabled" => device.background_enabled,
                :"bluetooth-enabled" => device.bluetooth_enabled
            }
        }
    end

    def pagination_type
        params.fetch(:paginationType, "number")
    end

    def index_by_page_number
        
        should_include = ["devices"]

        query = {
            fields: ["_id"],
            sort: [
                {
                    created_at: {
                        order: "desc"
                    }
                }
            ]
        }

        if customer_segment_id_query
            customer_segment = CustomerSegment.find(customer_segment_id_query)
            if customer_segment
                query.merge!(customer_segment.to_elasticsearch_query)
            end
        end


        customers = Elasticsearch::Model.search(query, [Customer], {index: Customer.get_index_name(current_account)})
        results = customers.per_page(page_size).page(current_page).results
        customers = Customer.find_all(results.map{ |hit| hit["_id"] })

        json = {
            "data" => customers.map{|customer| serialize_customer(customer)},
            "meta" => {
                "totalRecords" => results.total,
                "totalPages" => results.total_pages,
                "totalSearchableRecords" => current_account.customers_count
            }
        }
        included = []

        if should_include.include?("devices")
            included += customers.map{|customer| customer.devices.map{|device| serialize_device(device)}}.flatten
        end

        json["included"] = included if included.any?
        render json: json
    end

    def index_by_page_cursor

        should_include = ["devices"]

        query = {
                fields: ["_id"],
                sort: [
                    {
                        created_at: {
                            order: "desc"
                        }
                    }
                ]
            }

        client = Elasticsearch::Model.client

        if current_cursor
            cursor_opts = opts_from_cursor(current_cursor)
            begin
                response = client.scroll(scroll: '30m', scroll_id: cursor_opts[:scroll_id])
            rescue Elasticsearch::Transport::Errors::NotFound => e
                Rails.logger.warn(e)
                if customer_segment_id_query
                    customer_segment = CustomerSegment.find(customer_segment_id_query)
                    if customer_segment
                        query.merge!(customer_segment.to_elasticsearch_query)
                    end
                end
                response = client.search(index ::Customer.get_index_name(current_account), scroll: '30m', body: query.merge!(size: page_size, offset: cursor_opts[:offset]) )
            end
            new_offset = cursor_opts[:offset] + response["hits"]["hits"].length       
        else
            response = client.search(index: ::Customer.get_index_name(current_account), scroll: '30m', body: query.merge(size: page_size))
            new_offset = response["hits"]["hits"].length
        end


        customer_ids = response["hits"]["hits"].map{|document| document["_id"]}
        customers = Customer.find_all(customer_ids)

        if response["hits"]["hits"].any? && response["hits"]["hits"].length == page_size
            next_page_pointer = build_next_page_pointer(response["_scroll_id"], new_offset)
        end

        json = {
            "data" => customers.map{|customer| serialize_customer(customer)},
            "meta" => {
                "totalRecords" => response["hits"]["total"],
                "totalSearchableRecords" => current_account.customers_count,
            }
        }

        if next_page_pointer
            json.merge!({
                "links" => {
                    "next" => next_page_pointer
                }
            })
        end

        included = []

        if should_include.include?("devices")
            included += customers.map{|customer| customer.devices.map{|device| serialize_device(device)}}.flatten
        end

        json["included"] = included if included.any?
        render json: json

    end


    def build_next_page_pointer(scroll_id, offset)
        return Base64.urlsafe_encode64({scroll_id: scroll_id, offset: offset}.to_json)
    end


    def opts_from_cursor(cursor)
        data = Base64.urlsafe_decode64(cursor.to_s).to_s
        opts = JSON.parse(data)
        print "Cursor: #{opts}".bold.green
        return {
            offset: Integer(opts["offset"] || 0),
            scroll_id: opts["scroll_id"] 
        }
    end

end
