class V1::CustomerInboxLandingPageController < V1::ApplicationController
    before_action :authenticate
    before_action :set_message

    def show
        expires_in 365.days

        json = @message.landing_page ? @message.landing_page.as_json(dasherize: true) : {}

        render json: json
    end


    private


    def set_message
        @message = Message.find(params[:id])
        if @message.nil?
            head :not_found
        elsif @message.customer_id != current_customer.id
            head :forbidden
        end
    end

end
