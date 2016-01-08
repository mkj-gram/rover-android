class V1::AccountInvitesController < V1::ApplicationController
    before_action :authenticate

    # GET /account_invites
    def index
        @account_invites = current_account.account_invites.order("id").where("id >= ?", current_cursor).limit(page_size + 1)
        next_cursor = get_next_cursor(@account_invites, "id")
        # trim it since we included 1 extra record
        @account_invites = @account_invites.first(page_size)
        json = {
            "data" => @account_invites.map do |account_invite|
                V1::AccountInviteSerializer.s(account_invite).merge!(
                    {
                        "relationships"=> {
                            "issuer" => {
                                "data" => {
                                    "type" => "user",
                                    "id" => account_invite.issuer_id.to_s
                                }
                            }
                        }
                    }
                )
            end,
            "meta" => {
                "total_records"=> current_account.account_invites_count
            },
            "links" => {
                "next" => next_cursor.nil? ? nil : v1_users_url({"page[cursor]" => next_cursor})
            }
        }
        render json: json
    end

    # GET /account_invites/:token

    def show
        @account_invite = AccountInvite.find_by_token(params[:token])
        if @account_invite
            json = {
                "data" => {
                    "id" => @account_invite.id.to_s,
                    "type" => "account_invites",
                    "attributes" => {
                        "invite_email" => @account_invite.invited_email,
                        "issuer_id" => @account_invite.issuer_id.to_s,
                        "created_at" => @account_invite.created_at
                    },
                    "relationships" => {
                        "issuer" => {
                            "data" => {
                                "type" => "users",
                                "id" => @account_invite.issuer_id.to_s
                            }
                        },
                        "account" => {
                            "data" => {
                                "type" => "accounts",
                                "id" => @account_invite.account_id.to_s
                            }
                        }
                    }
                },
                included: [
                    V1::UserSerializer.s(@account_invite.issuer),
                    V1::AccountSerializer.s(@account_invite.account)
                ]

            }
            render json: json
        else
            head :not_found
        end
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
