class SharedBeaconConfiguration < ActiveRecord::Base

    belongs_to :owner_account, class_name: "Account", foreign_key: "owner_account_id"
    belongs_to :shared_account, class_name: "Account", foreign_key: "shared_account_id"
    belongs_to :beacon_configuration
end
