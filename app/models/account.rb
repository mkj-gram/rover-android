#
# Primary Account
#
# @author [chrisrecalis]
#
class Account < ActiveRecord::Base
    include Tokenable

    has_one :primary_user, class_name: "User", primary_key: "primary_user_id", foreign_key: "id"
    has_many :users, dependent: :destroy
    has_many :locations, dependent: :destroy
    has_many :beacon_configurations, dependent: :destroy
    # we can go innerjoin the beacon_configuration table with the ibeacons table
    # has_many :ibeacon_configurations, through: :beacon_configurations, source: :configurable, source_type: "IbeaconConfiguration"
    # or just directly look up from the ibeacons_table
    has_many :ibeacon_configurations, dependent: :destroy
    has_many :eddystone_namespace_configurations, dependent: :destroy
    has_many :eddystone_url_configurations, dependent: :destroy
    has_many :account_invites, dependent: :destroy

end
