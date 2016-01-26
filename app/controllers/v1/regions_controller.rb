class V1::RegionsController < V1::ApplicationController
    before_action :authenticate


    def index
        # this endpoint can ask for ibeacon, eddystone, location
        # protocols = [ibeacon, eddystone]
    end



    private


    def query_protocols
        @query_protocols ||= -> {
            protocols = filter_params.fetch(:protocols, [])
            protocol = filter_params.fetch(:protocol, nil)
            if protocols.empty? && !protocol.nil?
                protocols = [protocol]
            end
            return protocols
        }.call
    end

end
