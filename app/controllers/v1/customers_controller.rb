class V1::CustomersController < V1::ApplicationController

    before_action :authenticate
    before_action :check_access, only: [:index, :show, :create, :update, :destroy]
    before_action :set_customer, only: [:show]

    def index

        should_include = ["devices", "last-place"]

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

        if should_include.include?("last-place")
            place_ids  = customers.map{|customer| customer.last_place_visit_id }.compact
            if place_ids.any?
                places = Place.where(id: place_ids).all
                included += places.map{|place| V1::PlaceSerializer.serialize(place)}
            end
        end

        json["included"] = included if included.any?
        render json: json
    end

    def show

        included = @customer.devices.map{|device| serialize_device(device)}

        if !@customer.last_place_visit_id.nil?
            place = Place.find(@customer.last_place_visit_id)
            included.push(V1::PlaceSerializer.serialize(place)) if place
        end

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
        params.dig(:filter, :segment_id)
    end

    def render_customer(customer)
    end

    def serialize_customer(customer, places_cache = {})
        should_include = ["devices", "last-place"]

        relationships = {}

        if should_include.include?("devices")
            relationships[:devices] = { data: customer.devices.map { |device| { type: "devices", id: device.id }}}
        end

        if should_include.include?("last-place") && customer.last_place_visit_id
            relationships[:"last-place"] = { data: { type: "places", id: customer.last_place_visit_id }}
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
                :"local-notifications-enabled" => device.local_notifications_enabled,
                :"remote-notifications-enabled" => device.remote_notifications_enabled,
                :"location-monitoring-enabled" => device.location_monitoring_enabled,
                :"background-enabled" => device.background_enabled,
                :"bluetooth-enabled" => device.bluetooth_enabled
            }
        }
    end


end
