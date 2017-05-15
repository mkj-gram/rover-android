require 'rover-auth'

# global switch
USE_SVC=true
# testing: use stubs instead reaching out to services
TESTS_STUB_SVC=true && USE_SVC

AUTHSVC_CLIENT = Rover::Auth::V1::DefaultClient.new
