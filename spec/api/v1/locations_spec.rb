require 'rails_helper'

def location_attributes
    attributes = attributes_for(:location)
    attributes[:name] = attributes.delete(:title)
    return attributes
end


describe "/v1/locations", :type => :request do

    context "GET" do
        it 'returns 400 when bounds is specified but invalid' do
            account = create(:account)
            get '/v1/locations', {filter: {bounds: [999,999,999,999]}}, signed_request_header(account)

            expect(response).to have_http_status(400)
            expect(json[:errors].size).to be >=1
        end

        it 'returns 200 with no filters' do
            account = create(:account)
            get '/v1/locations', nil, signed_request_header(account)

            expect(response).to have_http_status(200)
        end

        it 'returns 200 with bounds filters' do
            account = create(:account)
            get '/v1/locations', {filter: {bounds: [0,0,0,0]}}, signed_request_header(account)

            expect(response).to have_http_status(200)
        end

        it 'returns 200 when a location exists' do
            location = create(:location)
            account = location.account
            get "/v1/locations/#{location.id}", nil, signed_request_header(account)

            expect(response).to have_http_status(200)

            expect(json).to have_key(:data)
            expect(json.dig(:data, :id)).to eq(location.id.to_s)
            attributes = json.dig(:data, :attributes)
            expect(attributes).not_to eq(nil)
            expect(attributes.dig(:name)).to eq(location.title)
            expect(attributes.dig(:address)).to eq(location.address)
            expect(attributes.dig(:latitude).round(10)).to eq(location.latitude.round(10))
            expect(attributes.dig(:longitude).round(10)).to eq(location.longitude.round(10))
        end


    end

    context "POST" do
        context "invalid input" do
            it 'returns 422 when latitude is out of bounds' do
                account = create(:account)
                attributes = location_attributes
                attributes[:latitude] = 10000000
                post '/v1/locations',
                {
                    data: {
                        type: "locations",
                        attributes: attributes
                    }
                }, signed_request_header(account)

                expect(response).to have_http_status(422)
                expect(json[:errors].size).to be >=1
            end

            it 'returns 422 when longitude is out of bounds' do
                account = create(:account)
                attributes = location_attributes
                attributes[:longitude] = 10000000
                post '/v1/locations',
                {
                    data: {
                        type: "locations",
                        attributes: attributes
                    }
                }, signed_request_header(account)

                expect(response).to have_http_status(422)
                expect(json[:errors].size).to be >=1
            end

            it 'returns 422 when name is not included' do
                account = create(:account)
                attributes = location_attributes
                attributes[:name] = nil
                post '/v1/locations',
                {
                    data: {
                        type: "locations",
                        attributes: attributes
                    }
                }, signed_request_header(account)

                expect(response).to have_http_status(422)
                expect(json[:errors].size).to be >=1
            end


            it 'returns 422 when passed an invalid google-place-id' do
                account = create(:account)
                post '/v1/locations',
                {
                    data: {
                        type: "locations",
                        attributes: {
                            :"google-place-id" => "111"
                        }
                    }
                }, signed_request_header(account)

                expect(response).to have_http_status(422)
                expect(json[:errors].size).to be >=1
            end
        end

        context "valid input" do
            it 'returns 200 when providing everything but the google-place-id' do
                account = create(:account)
                attributes = location_attributes
                post '/v1/locations',
                {
                    data: {
                        type: "locations",
                        attributes: attributes
                    }
                }, signed_request_header(account)

                expect(response).to have_http_status(200)
            end

            it 'returns 200 when providing just the google-place-id' do
                account = create(:account)
                attributes = location_attributes
                post '/v1/locations',
                {
                    data: {
                        type: "locations",
                        attributes: {
                            :"google-place-id" => "ChIJWb7ra-AY1YkRCbp8uCzA3_c"
                        }
                    }
                }, signed_request_header(account)

                expect(response).to have_http_status(200)
            end
        end
    end

    context "PATCH" do
        context "invalid input" do
            it 'returns 422 when latitude is out of bounds' do
                location = create(:location)
                account = location.account
                patch "/v1/locations/#{location.id}",
                {
                    data: {
                        type: "locations",
                        attributes: {
                            latitude: 123123123
                        }
                    }
                }, signed_request_header(account)

                expect(response).to have_http_status(422)
                expect(json[:errors].size).to be >=1
            end

            it 'returns 422 when longitude is out of bounds' do
                location = create(:location)
                account = location.account
                patch "/v1/locations/#{location.id}",
                {
                    data: {
                        type: "locations",
                        attributes: {
                            longitude: 123123123
                        }
                    }
                }, signed_request_header(account)

                expect(response).to have_http_status(422)
                expect(json[:errors].size).to be >=1
            end

            it 'returns 422 when radius is not in the specified bounds' do
                location = create(:location)
                account = location.account
                patch "/v1/locations/#{location.id}",
                {
                    data: {
                        type: "locations",
                        attributes: {
                            radius: 123123123
                        }
                    }
                }, signed_request_header(account)

                expect(response).to have_http_status(422)
                expect(json[:errors].size).to be >=1
            end

            it 'returns 422 when passed an invalid google-place-id' do
                location = create(:location)
                account = location.account
                patch "/v1/locations/#{location.id}",
                {
                    data: {
                        type: "locations",
                        attributes: {
                            :"google-place-id" => "123123123"
                        }
                    }
                }, signed_request_header(account)

                expect(response).to have_http_status(422)
                expect(json[:errors].size).to be >=1
            end
        end

        context "valid input" do
            it 'returns 200 when updating the address' do
                location = create(:location)
                account = location.account
                patch "/v1/locations/#{location.id}",
                {
                    data: {
                        type: "locations",
                        attributes: {
                            address: "new address"
                        }
                    }
                }, signed_request_header(account)

                expect(response).to have_http_status(200)
                expect(json.dig(:data, :attributes, :address)).to eq("new address")
            end
        end
    end

    context "DESTROY" do
        it 'return 204 no content and 404 gone' do
            location = create(:location)
            account = location.account
            delete "/v1/locations/#{location.id}", nil, signed_request_header(account)

            expect(response).to have_http_status(204)

            get "/v1/locations/#{location.id}", nil, signed_request_header(account)

            expect(response).to have_http_status(404)
        end
    end
end
