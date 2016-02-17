class V1::CustomersController < V1::ApplicationController

    before_action :authenticate

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

        render json: json
    end


    private

    def serialize_elasticsearch_customer(customer)
        source = customer._source
        return source
    end
end
