require 'test_helper'

class AccountInvitesControllerTest < ActionController::TestCase
  setup do
    @account_invite = account_invites(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:account_invites)
  end

  test "should create account_invite" do
    assert_difference('AccountInvite.count') do
      post :create, account_invite: { account_id: @account_invite.account_id, email: @account_invite.email, issuer_id: @account_invite.issuer_id, token: @account_invite.token }
    end

    assert_response 201
  end

  test "should show account_invite" do
    get :show, id: @account_invite
    assert_response :success
  end

  test "should update account_invite" do
    put :update, id: @account_invite, account_invite: { account_id: @account_invite.account_id, email: @account_invite.email, issuer_id: @account_invite.issuer_id, token: @account_invite.token }
    assert_response 204
  end

  test "should destroy account_invite" do
    assert_difference('AccountInvite.count', -1) do
      delete :destroy, id: @account_invite
    end

    assert_response 204
  end
end
