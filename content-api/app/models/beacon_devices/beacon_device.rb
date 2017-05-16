class BeaconDevice < ActiveRecord::Base
    
    class JSONSerializer
        def self.dump(hash)
            hash.to_json
        end

        def self.load(hash)
            (hash || {}).with_indifferent_access
        end
    end

    serialize :device_data, BeaconDevice::JSONSerializer

    belongs_to :third_party_integration
    belongs_to :beacon_configuration
    belongs_to :account

    # validate :belongs_to_a_beacon_configuration




    private

    def belongs_to_a_beacon_configuration
        if beacon_configuration.nil?
            errors.add(:beacon_configuration, "this device needs a beacon configuration to operate")
        end
    end



end
