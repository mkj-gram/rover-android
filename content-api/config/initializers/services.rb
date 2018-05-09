require 'rover-auth'
require 'notification/v1/notification_pb'
require 'notification/v1/notification_services_pb'


# global switch
USE_SVC=true
# testing: use stubs instead reaching out to services
TESTS_STUB_SVC=true && USE_SVC

AUTHSVC_CLIENT = Rover::Auth::V1::DefaultClient.new
NOTIFICATION_CLIENT = Rover::Notification::V1::Notification::Stub.new(ENV.fetch("NOTIFICATION_SERVICE_URL"), :this_channel_is_insecure)
