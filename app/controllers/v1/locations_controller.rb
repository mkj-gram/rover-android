class V1::LocationsController < V1::ApplicationController

    before_action :validate_json_schema,    only: [:create, :update]


    def index
        # use elasticsearch
    end

    def show
    end

    def update
    end
    def create
    end

    def destroy
    end

end
