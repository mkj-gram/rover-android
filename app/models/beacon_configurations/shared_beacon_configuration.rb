class SharedBeaconConfiguration < ActiveRecord::Base

    belongs_to :owner_account, class_name: "Account", foreign_key: "owner_account_id"
    belongs_to :shared_account, class_name: "Account", foreign_key: "shared_account_id"
    belongs_to :beacon_configuration

    after_create :re_index_beacon_configuration
    after_create :re_index_beacon_configuration



    private

    def re_index_beacon_configuration
        beacon_configuration.__elastic_search.update_document
    end

end
