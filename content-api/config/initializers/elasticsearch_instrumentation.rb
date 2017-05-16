ActiveSupport::Notifications.subscribe('search.elasticsearch') do |name, start, finish, id, payload|
    if payload.dig(:search, :index) && payload.dig(:search, :type)
        index = payload.dig(:search, :index)
        index = index.first if index.is_a?(Array)
        type = payload.dig(:search, :type)
        type = type.first if type.is_a?(Array)
        source =  "#{index}-#{type}"
        MetricsClient.aggregate(name => {value: ((finish - start) * 1000).round(2), source: source })
    end
end
