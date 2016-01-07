class V1::AccountInvitesController < V1::ApplicationController
    before_action :authenticate
    before_action :set_resource, only: [:show, :update, :destroy]
    before_action :check_access

    # GET /account_invites
    # GET /account_invites.json
    def index

        # set_total_records(current_account.account_invites_count)
        # @account_invites = current_account.account_invites.order("create_at").paginate(page: current_page, per_page: page_size)
        # render json: @account_invites, each_serializer: V1::UserSerializer , root: "data", meta: page_meta(v1_users_url)
    end

    # GET /account_invites/1
    # GET /account_invites/1.json
    def show
        render json: @account_invite
    end

    # POST /account_invites
    # POST /account_invites.json
    def create
        @account_invite = AccountInvite.new(account_invite_params)
        @account_invite.account_id = current_account.id
        @account_invite.issuer_id = !current_user.nil? ? current_user.id : current_account.primary_user_id
        if @account_invite.save
            render json: @account_invite, status: :created, location: @account_invite
        else
            render json: @account_invite.errors, status: :unprocessable_entity
        end
    end

    # PATCH/PUT /account_invites/1
    # PATCH/PUT /account_invites/1.json
    def update
        @account_invite = AccountInvite.find(params[:id])

        if @account_invite.update(account_invite_params)
            head :no_content
        else
            render json: @account_invite.errors, status: :unprocessable_entity
        end
    end

    # DELETE /account_invites/1
    # DELETE /account_invites/1.json
    def destroy
        @account_invite.destroy

        head :no_content
    end

    private

    def set_account_invite
        @account_invite = AccountInvite.find(params[:id])
    end

    def account_invite_params
        params.require(:account_invite).permit(:invite_email, :token)
    end
end
