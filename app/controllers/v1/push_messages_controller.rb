class V1::PushMessagesController < V1::ApplicationController
    before_action :authenticate
    before_action :validate_json_schema,    only: [:create, :update]

    def index
    end

    def show
    end

    def create
    end

    def update
    end

    def destroy
    end
end
