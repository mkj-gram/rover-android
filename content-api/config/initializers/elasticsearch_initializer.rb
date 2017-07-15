urls = Rails.configuration.elasticsearch["urls"]
Elasticsearch::Model.client = Elasticsearch::Client.new(hosts: urls, transport_options: { ssl: { verify: false }})