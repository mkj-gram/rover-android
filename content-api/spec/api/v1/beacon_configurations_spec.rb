require 'rails_helper'

describe "/v1/configurations", :type => :request do

  let(:account) { create(:account) }
  let(:user) { create(:user, account: account) }
  let(:session) { create(:session, user: user, account: account) }
  let(:config) { create(:ibeacon_configuration, account: account)}

  before :each do
    nothing_authenticates

    auth_token(session.account.token, account_id: session.account.id, scopes: ['admin'])
  end

  context "GET" do
    it 'returns 200ok when a config exists' do
      get "/v1/configurations/#{config.id}", nil, signed_request_header(account)

      expect(response).to have_http_status(200)

      expect(json).to have_key(:data)
      expect(json.dig(:data, :id)).to eq(config.id.to_s)
      expect(json.dig(:data, :attributes, :name)).to eq(config.title)
      expect(json.dig(:data, :attributes, :uuid)).to eq(config.uuid)
      expect(json.dig(:data, :attributes, :"major-number")).to eq(config.major)
      expect(json.dig(:data, :attributes, :"minor-number")).to eq(config.minor)
    end

    it "returns 404 when a config doesn't exist" do
      get "/v1/configurations/notanid", nil, signed_request_header(account)

      expect(response).to have_http_status(404)
    end
  end

  context "POST" do
    context "input is invalid" do
      context "ibeacon protocol" do
        it 'returns 422 when name is missing' do
          post "/v1/configurations",
            {
            data: {
              type: "configurations",
              attributes: {
                protocol: "iBeacon",
                uuid: SecureRandom.uuid,
                :"major-number" => 1,
                :"minor-number" => 1
              }
            }
          }, signed_request_header(account)

          expect(response).to have_http_status(422)
          expect(json.dig(:errors).size).to be >= 1
          error = json[:errors].first
          expect(error.dig(:source, :pointer)).to eq("data/attributes/name")

        end
        it 'returns 422 when uuid is missing' do
          post "/v1/configurations",
            {
            data: {
              type: "configurations",
              attributes: {
                protocol: "iBeacon",
                name: "Hello",
                :"major-number" => 1,
                :"minor-number" => 1
              }
            }
          }, signed_request_header(account)


          expect(response).to have_http_status(422)
          expect(json.dig(:errors).size).to be >= 1
          error = json[:errors].first
          expect(error.dig(:source, :pointer)).to eq("data/attributes/uuid")

        end
        it 'returns 422 when major is missing' do
          post "/v1/configurations",
            {
            data: {
              type: "configurations",
              attributes: {
                protocol: "iBeacon",
                name: "Hello",
                uuid: SecureRandom.uuid,
                :"minor-number" => 1
              }
            }
          }, signed_request_header(account)


          expect(response).to have_http_status(422)
          expect(json.dig(:errors).size).to be >= 1
          error = json[:errors].first
          expect(error.dig(:source, :pointer)).to eq("data/attributes/major-number")

        end
        it 'returns 422 when minor is missing' do
          post "/v1/configurations",
            {
            data: {
              type: "configurations",
              attributes: {
                protocol: "iBeacon",
                name: "Hello",
                uuid: SecureRandom.uuid,
                :"major-number" => 1,
              }
            }
          }, signed_request_header(account)


          expect(response).to have_http_status(422)
          expect(json.dig(:errors).size).to be >= 1
          error = json[:errors].first
          expect(error.dig(:source, :pointer)).to eq("data/attributes/minor-number")

        end

        it 'returns 422 when major is out of range' do
          post "/v1/configurations",
            {
            data: {
              type: "configurations",
              attributes: {
                protocol: "iBeacon",
                name: "Hello",
                uuid: SecureRandom.uuid,
                :"major-number" => -1,
                :"minor-number" => 1
              }
            }
          }, signed_request_header(account)


          expect(response).to have_http_status(422)
          expect(json.dig(:errors).size).to be >= 1
          error = json[:errors].first
          expect(error.dig(:source, :pointer)).to eq("data/attributes/major-number")

        end

        it 'returns 422 when minor is out of range' do
          post "/v1/configurations",
            {
            data: {
              type: "configurations",
              attributes: {
                protocol: "iBeacon",
                name: "Hello",
                uuid: SecureRandom.uuid,
                :"major-number" => 1,
                :"minor-number" => -1
              }
            }
          }, signed_request_header(account)


          expect(response).to have_http_status(422)
          expect(json.dig(:errors).size).to be >= 1
          error = json[:errors].first
          expect(error.dig(:source, :pointer)).to eq("data/attributes/minor-number")

        end
        it 'returns 422 when uuid major minor already exists' do
          post "/v1/configurations",
            {
            data: {
              type: "configurations",
              attributes: {
                protocol: "iBeacon",
                name: "Hello",
                uuid: config.uuid,
                :"major-number" => config.major,
                :"minor-number" => config.minor
              }
            }
          }, signed_request_header(account)


          expect(response).to have_http_status(422)
          expect(json.dig(:errors).size).to be >= 1
          error = json[:errors].first
          expect(error.dig(:source, :pointer)).to eq("data")

        end
        it 'returns 422 when place doesnt exist' do
          place = create(:place, account: account)
          uuid = SecureRandom.uuid
          post "/v1/configurations",
            {
            data: {
              type: "configurations",
              attributes: {
                protocol: "iBeacon",
                name: "Hello",
                uuid: uuid,
                :"major-number" => 1,
                :"minor-number" => 1
              },
              relationships: {
                place: {
                  data: {type: "places", id: "-1"}
                }
              }
            }
          }, signed_request_header(account)

          expect(response).to have_http_status(422)
        end
      end
    end
    context "input is valid" do
      context "ibeacon protocol" do
        it 'returns 200 ok when uuid, major, minor is supplied' do
          uuid = SecureRandom.uuid.upcase
          post "/v1/configurations",
            {
            data: {
              type: "configurations",
              attributes: {
                protocol: "iBeacon",
                name: "Hello",
                uuid: uuid,
                :"major-number" => 1,
                :"minor-number" => 1
              }
            }
          }, signed_request_header(account)

          expect(response).to have_http_status(200)

          expect(json.dig(:data, :attributes, :uuid)).to eq(uuid)
          expect(json.dig(:data, :attributes, :"major-number")).to eq(1)
          expect(json.dig(:data, :attributes, :"minor-number")).to eq(1)
        end

        it 'returns 200 ok when uuid, major, minor is supplied with a place' do
          skip "times out"

          place = create(:place, account: account)
          uuid = SecureRandom.uuid.upcase
          post "/v1/configurations",
            {
            data: {
              type: "configurations",
              attributes: {
                protocol: "iBeacon",
                name: "Hello",
                uuid: uuid,
                :"major-number" => 1,
                :"minor-number" => 1
              },
              relationships: {
                place: {
                  data: {type: "places", id: place.id.to_s}
                }
              }
            }
          }, signed_request_header(account)

          expect(response).to have_http_status(200)

          expect(json.dig(:data, :attributes, :uuid)).to eq(uuid)
          expect(json.dig(:data, :attributes, :"major-number")).to eq(1)
          expect(json.dig(:data, :attributes, :"minor-number")).to eq(1)

        end
      end
    end
  end

  context "PATCH" do
    context "invalid input" do
      xit 'returns 422 error' do
        config = create(:ibeacon_configuration)
      end
    end

    context "valid input" do
      it 'returns 200 ok when updating the name' do

        new_name = "Not the same name"
        patch "/v1/configurations/#{config.id}",
          {
          data: {
            type: "configurations",
            id: config.id.to_s,
            attributes: {
              name: new_name
            }
          }
        }, signed_request_header(account)

        expect(response).to have_http_status(200)


        expect(json.dig(:data, :attributes, :name)).to eq(new_name)
      end

      it 'returns 200 ok when adding a tag' do

        new_tags = config.tags + ["A NEW TAG"]

        patch "/v1/configurations/#{config.id}",
          {
          data: {
            type: "configurations",
            id: config.id.to_s,
            attributes: {
              tags: new_tags
            }
          }
        }, signed_request_header(account)

        expect(response).to have_http_status(200)


        expect(json.dig(:data, :attributes, :tags)).to eq(new_tags)
      end

      it 'returns 200 ok when removing a tag' do
        new_tags = config.tags[0..1]

        patch "/v1/configurations/#{config.id}",
          {
          data: {
            type: "configurations",
            id: config.id.to_s,
            attributes: {
              tags: new_tags
            }
          }
        }, signed_request_header(account)

        expect(response).to have_http_status(200)


        expect(json.dig(:data, :attributes, :tags)).to eq(new_tags)
      end

      xit 'returns 200 ok when removing ALL tags' do

        patch "/v1/configurations/#{config.id}",
          {
          data: {
            type: "configurations",
            id: config.id.to_s,
            attributes: {
              tags: [],
            }
          }
        }, signed_request_header(account)


        expect(response).to have_http_status(200)


        expect(json.dig(:data, :attributes, :tags)).to eq([])
      end


    end
  end

  context "DESTROY" do
    it 'returns 204 no_content' do
      delete "/v1/configurations/#{config.id}", nil, signed_request_header(account)

      expect(response).to have_http_status(204)
    end
  end
end