require 'rails_helper'

def place_attributes
    attributes = attributes_for(:place)
    attributes[:name] = attributes.delete(:title)
    return attributes
end


describe "/v1/places", :type => :request do

    context "GET" do
        it 'returns 400 when bounds is specified but invalid' do
            account = create(:account)
            get '/v1/places', {filter: {bounds: [999,999,999,999]}}, signed_request_header(account)

            expect(response).to have_http_status(400)
            expect(json[:errors].size).to be >=1
        end

        it 'returns 200 with no filters' do
            account = create(:account)
            get '/v1/places', nil, signed_request_header(account)

            expect(response).to have_http_status(200)
        end

        it 'returns 200 with bounds filters' do
            account = create(:account)
            get '/v1/places', {filter: {bounds: [0,0,0,0]}}, signed_request_header(account)

            expect(response).to have_http_status(200)
        end

        it 'returns 200 when a place exists' do
            place = create(:place)
            account = place.account
            get "/v1/places/#{place.id}", nil, signed_request_header(account)

            expect(response).to have_http_status(200)

            expect(json).to have_key(:data)
            expect(json.dig(:data, :id)).to eq(place.id.to_s)
            attributes = json.dig(:data, :attributes)
            expect(attributes).not_to eq(nil)
            expect(attributes.dig(:name)).to eq(place.title)
            expect(attributes.dig(:address)).to eq(place.address)
            expect(attributes.dig(:latitude).round(10)).to eq(place.latitude.round(10))
            expect(attributes.dig(:longitude).round(10)).to eq(place.longitude.round(10))
        end


    end

    context "POST" do
        context "invalid input" do
            it 'returns 422 when latitude is out of bounds' do
                account = create(:account)
                attributes = place_attributes
                attributes[:latitude] = 10000000
                post '/v1/places',
                {
                    data: {
                        type: "places",
                        attributes: attributes
                    }
                }, signed_request_header(account)

                expect(response).to have_http_status(422)
                expect(json[:errors].size).to be >=1
            end

            it 'returns 422 when longitude is out of bounds' do
                account = create(:account)
                attributes = place_attributes
                attributes[:longitude] = 10000000
                post '/v1/places',
                {
                    data: {
                        type: "places",
                        attributes: attributes
                    }
                }, signed_request_header(account)

                expect(response).to have_http_status(422)
                expect(json[:errors].size).to be >=1
            end

            it 'returns 422 when name is not included' do
                account = create(:account)
                attributes = place_attributes
                attributes[:name] = nil
                post '/v1/places',
                {
                    data: {
                        type: "places",
                        attributes: attributes
                    }
                }, signed_request_header(account)

                expect(response).to have_http_status(422)
                expect(json[:errors].size).to be >=1
            end

        end

        context "valid input" do
            it 'returns 200 when input is valid' do
                account = create(:account)
                attributes = place_attributes
                post '/v1/places',
                {
                    data: {
                        type: "places",
                        attributes: attributes
                    }
                }, signed_request_header(account)

                expect(response).to have_http_status(200)
            end
        end
    end

    context "PATCH" do
        context "invalid input" do
            it 'returns 422 when latitude is out of bounds' do
                place = create(:place)
                account = place.account
                patch "/v1/places/#{place.id}",
                {
                    data: {
                        type: "places",
                        attributes: {
                            latitude: 123123123
                        }
                    }
                }, signed_request_header(account)

                expect(response).to have_http_status(422)
                expect(json[:errors].size).to be >=1
            end

            it 'returns 422 when longitude is out of bounds' do
                place = create(:place)
                account = place.account
                patch "/v1/places/#{place.id}",
                {
                    data: {
                        type: "places",
                        attributes: {
                            longitude: 123123123
                        }
                    }
                }, signed_request_header(account)

                expect(response).to have_http_status(422)
                expect(json[:errors].size).to be >=1
            end

            it 'returns 422 when radius is not in the specified bounds' do
                place = create(:place)
                account = place.account
                patch "/v1/places/#{place.id}",
                {
                    data: {
                        type: "places",
                        attributes: {
                            radius: 123123123
                        }
                    }
                }, signed_request_header(account)

                expect(response).to have_http_status(422)
                expect(json[:errors].size).to be >=1
            end

        end

        context "valid input" do
            it 'returns 200 when updating the address' do
                place = create(:place)
                account = place.account
                patch "/v1/places/#{place.id}",
                {
                    data: {
                        type: "places",
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
            place = create(:place)
            account = place.account
            delete "/v1/places/#{place.id}", nil, signed_request_header(account)

            expect(response).to have_http_status(204)

            get "/v1/places/#{place.id}", nil, signed_request_header(account)

            expect(response).to have_http_status(404)
        end
    end
end
