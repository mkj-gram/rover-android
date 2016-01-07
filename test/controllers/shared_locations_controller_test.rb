require 'test_helper'

class SharedLocationsControllerTest < ActionController::TestCase
  setup do
    @shared_location = shared_locations(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:shared_locations)
  end

  test "should create shared_location" do
    assert_difference('SharedLocation.count') do
      post :create, shared_location: {  }
    end

    assert_response 201
  end

  test "should show shared_location" do
    get :show, id: @shared_location
    assert_response :success
  end

  test "should update shared_location" do
    put :update, id: @shared_location, shared_location: {  }
    assert_response 204
  end

  test "should destroy shared_location" do
    assert_difference('SharedLocation.count', -1) do
      delete :destroy, id: @shared_location
    end

    assert_response 204
  end
end
