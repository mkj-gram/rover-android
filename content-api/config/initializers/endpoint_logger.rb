# http://guides.rubyonrails.org/active_support_instrumentation.html
ActiveSupport::Notifications.subscribe('process_action.action_controller') do |name, start, finish, id, payload|
  Rails.logger.info("#{name} method=#{payload[:method]} path=#{payload[:path]} status=#{payload[:status]} action=#{payload[:action]} ")
end
