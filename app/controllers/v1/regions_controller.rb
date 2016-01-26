class V1::RegionsController < V1::ApplicationController
    before_action :authenticate


    def index
        # this endpoint can ask for ibeacon, eddystone, location
        # protocols = [ibeacon, eddystone]
        # selects all unique ibeacons
        ibeacons = IBeaconConfiguration.select("DISTINCT on(uuid) *").where(account_id: 1).all
        json = {
            "data" => ibeacons.map{|ibeacon| serialize_beacon_region(ibeacon)}
        }

        render json: json
    end



    private

    def serialize_beacon_region(ibeacon)
        {
            "type" => "beacon-regions",
            "id" => ibeacon.id.to_s,
            "attributes" => {
                "uuid" => ibeacon.uuid,
                "major" => nil,
                "minor" => nil
            }
        }
    end

end
