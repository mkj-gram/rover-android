ActiveSupport::Notifications.subscribe('search.elasticsearch') do |name, start, finish, id, payload|
    MetricsClient.aggregate(name => {value: ((finish - start) * 1000).round(2), source: payload[:klass]})
end
