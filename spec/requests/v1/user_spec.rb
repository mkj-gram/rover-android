require 'rails_helper'

RSpec.describe "User API", :type => :request do
    it "creates a new user" do
        user = User.create({
                             name: "Rover Test",
                             email: "test@rover.io",
                             password: ""
        })
        # get "/login"
        # assert_select "form.login" do
        #   assert_select "input[name=?]", "username"
        #   assert_select "input[name=?]", "password"
        #   assert_select "input[type=?]", "submit"
        # end

        # post "/login", :username => "jdoe", :password => "secret"
        # assert_select ".header .username", :text => "jdoe"
    end
end
