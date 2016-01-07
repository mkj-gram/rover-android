class IbeaconConfiguration < ActiveRecord::Base

    has_one :beacon_configuration, as: :configurable, dependent: :destroy
    belongs_to :account, counter_cache: true

    after_create :create_beacon_configuration_copy_account_id, if: -> {beacon_configuration.nil?}



    private

    def create_beacon_configuration_copy_account_id
        create_beacon_configuration(account_id: self.account_id)
    end




end
