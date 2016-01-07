class V1::LocationSearchController < V1::ApplicationController
    before_action :authenticate
    before_action :check_access
end
