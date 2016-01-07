class V1::AccountsController < V1::ApplicationController
    before_action :authenticate


    # GET /accounts/1
    # GET /accounts/1.json
    def show
        render json: @account
    end

    # PATCH/PUT /accounts/1
    # PATCH/PUT /accounts/1.json
    def update
        @account = Account.find(params[:id])
        if @account.update(account_params)
            head :no_content
        else
            render json: @account.errors, status: :unprocessable_entity
        end
    end

    # DELETE /accounts/1
    # DELETE /accounts/1.json
    def destroy
        @account.destroy
        head :no_content
    end

    private

    def account_params
        params.require(:account).permit(:title)
    end
end
