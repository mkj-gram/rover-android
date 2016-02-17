class V1::CustomersController < V1::ApplicationController

    before_action :authenticate
    before_action :set_customer, only: [:show]

    def index


        query = {
            query: {
                filtered: {
                    query: {match_all: {}},
                    filter: {
                        bool: {
                            must: [
                                {term: {account_id: current_account.id}}
                            ]
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


        customers = Elasticsearch::Model.search(query, [Customer])
        results = customers.per_page(page_size).page(current_page).results
        json = {
            "data" => results.map{|customer| serialize_elasticsearch_customer(customer)},
            "meta" => {
                "totalRecords" => results.total,
                "totalPages" => results.total_pages,
                "totalSearchableRecords" => current_account.customers_count
            }
        }
        json["included"] = results.map{|customer| customer.devices.map{|device| serialize_device(device)}}.flatten
        render json: json
    end

    def show
        json = {
            data: serialize_customer(@customer),
            included: @customer.devices.map{|device| serialize_device(device)}
        }
        render json: json
    end

    private

    def set_customer
        @customer = Customer.find_by_id(params[:id])
        head :not_found if @customer.nil?
    end

    def serialize_customer(customer)
        {
            type: "customers",
            id: customer.id.to_s,
            attributes: {
                identifier: customer.identifier,
                name: customer.name,
                email: customer.email,
                :"phone-number" => customer.phone_number,
                tags: customer.tags,
                traits: customer.traits
            },
            relationships: {
                devices: {
                    data: customer.devices.map{|device| {type: "devices", id: device.id }}
                }
            }
        }
    end

    def serialize_elasticsearch_customer(customer)
        source = customer._source
        {
            type: "customers",
            id: customer.id,
            attributes: {
                identifier: source.identifier,
                name: source.name,
                email: source.email,
                :"phone-number" => source.phone_number,
                tags: source.tags,
                traits: source.traits
            },
            relationships: {
                devices: {
                    data: source.devices.map{|device| {type: "devices", id: device.id }}
                }
            }
        }
    end

    def serialize_device(device)
        {
            type: "devices",
            id: device.id.to_s,
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
