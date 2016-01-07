require 'test_helper'

class SharedBeaconsControllerTest < ActionController::TestCase
  setup do
    @shared_beacon = shared_beacons(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:shared_beacons)
  end

  test "should create shared_beacon" do
    assert_difference('SharedBeacon.count') do
      post :create, shared_beacon: {  }
    end

    assert_response 201
  end

  test "should show shared_beacon" do
    get :show, id: @shared_beacon
    assert_response :success
  end

  test "should update shared_beacon" do
    put :update, id: @shared_beacon, shared_beacon: {  }
    assert_response 204
  end

  test "should destroy shared_beacon" do
    assert_difference('SharedBeacon.count', -1) do
      delete :destroy, id: @shared_beacon
    end

    assert_response 204
  end
end
