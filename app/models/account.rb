#
# Primary Account
#
# @author [chrisrecalis]
#
class Account < ActiveRecord::Base
    include Tokenable

    before_create :generate_share_key

    has_one :primary_user, class_name: "User", primary_key: "primary_user_id", foreign_key: "id"
    has_many :users, dependent: :destroy
    has_many :locations, dependent: :destroy
    has_many :beacon_configurations, dependent: :destroy do
        def ibeacons
            where(type: "IBeaconConfiguration")
        end

        def eddystone_namespaces
            where(type: "EddystoneNamespaceConfiguration")
        end

        def urls
            where(type: "UrlConfiguration")
        end
    end
    has_many :active_shared_beacon_configurations, class_name: "SharedBeaconConfiguration", foreign_key: "owner_account_id"
    has_many :passive_shared_beacon_configurations, class_name: "SharedBeaconConfiguration", foreign_key: "shared_account_id"

    has_many :shared_beacon_configurations, through: :active_shared_beacon_configurations, source: :beacon_configuration
    has_many :shared_with_me_beacon_configurations, through: :passive_shared_beacon_configurations, source: :beacon_configuration

    has_many :beacon_configuration_active_tags
    has_many :location_active_tags

    has_many :third_party_integrations do
        def enabled
            where(enabled: true)
        end
    end

    has_many :estimote_integrations
    has_many :kontakt_integrations

    # we can go innerjoin the beacon_configuration table with the ibeacons table
    # has_many :ibeacon_configurations, through: :beacon_configurations, source: :configurable, source_type: "IbeaconConfiguration"
    # or just directly look up from the ibeacons_table
    # has_many :ibeacon_configurations, dependent: :destroy, class_name: "IBeaconConfiguration"
    # has_many :eddystone_namespace_configurations, dependent: :destroy
    # has_many :eddystone_url_configurations, dependent: :destroy
    has_many :account_invites, dependent: :destroy

    def location_bounding_box_suggestion
        query = {
            size: 0,
            query: {
                filtered: {
                    filter: {
                        bool: {
                            should: [
                                {
                                    term: { account_id: 1 }
                                },
                                {
                                    term: { shared_account_ids: 1}
                                }
                            ]
                        }
                    }
                }
            },
            aggs: {
                geo_hash: {
                    geohash_grid: {
                        size: 1,
                        precision: 2,
                        field: "location"
                    },
                    aggs: {
                        cell: {
                            geo_bounds: {
                                field: "location"
                            }
                        }
                    }
                }
            }
        }

        response = Elasticsearch::Model.search(query, [Location]).response
        return nil if response.aggregations.geo_hash.buckets.empty?
        bounds = response.aggregations.geo_hash.buckets.first.cell.bounds
        return [bounds.top_left.lat, bounds.bottom_right.lon, bounds.bottom_right.lat, bounds.top_left.lon]
    end

    private

    def generate_share_key
        self.share_key = loop do
            random_token = SecureRandom.hex(16)
            break random_token unless Account.exists?(share_key: random_token)
        end
    end

end
