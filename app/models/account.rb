#
# Primary Account
#
# @author [chrisrecalis]
#
class Account < ActiveRecord::Base
    include Tokenable
    include MessageLimit::Attribute

    message_limit_attribute :message_limits

    before_create :generate_share_key
    after_create :create_active_tags_index
    after_create :create_active_configuration_uuids_index
    after_create :create_customer_elasticsearch_alias
    after_create :create_admin_role
    after_create :create_platforms

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
    has_many :estimote_integrations
    has_many :kontakt_integrations
    has_many :customer_segments
    has_many :account_invites, dependent: :destroy
    has_many :user_roles
    has_one :default_user_role, class_name: "UserRole", primary_key: "default_user_role_id", foreign_key: "id"
    has_one :beacon_configuration_active_tag
    has_one :location_active_tag
    has_one :ibeacon_configuration_uuids, class_name: "ActiveIBeaconConfigurationUuid"
    has_one :eddystone_namespace_configuration_uuids, class_name: "ActiveEddystoneConfigurationUuid"

    has_many :third_party_integrations do
        def enabled
            where(enabled: true)
        end
    end

    has_many :proximity_message_templates


    has_many :gimbal_places

    has_many :platforms
    has_one :android_platform
    has_one :ios_platform

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

    def within_message_limits(inbox_global_message_rate)
        # looks like this
        # {1 => 2, 2 => 2, 3 => 1}
        # 2 messages within 1 day, 2 messages within 2 days, 1 message within 3 days
        message_limits.all? do |limiter|
            inbox_global_message_rate[limiter.number_of_minutes] < limiter.message_limit
        end
    end

    private

    def create_customer_elasticsearch_alias
        Customer.create_alias!(self)
    end

    def create_active_tags_index
        BeaconConfigurationActiveTag.create(account_id: self.id)
        LocationActiveTag.create(account_id: self.id)
    end

    def create_active_configuration_uuids_index
        ActiveEddystoneConfigurationUuid.create(account_id: self.id)
        ActiveIBeaconConfigurationUuid.create(account_id: self.id)
    end

    def generate_share_key
        self.share_key = loop do
            random_token = SecureRandom.hex(16)
            break random_token unless Account.exists?(share_key: random_token)
        end
    end

    def create_admin_role
        admin_role = UserRole.admin_role
        admin_role.account_id = self.id
        admin_role.save
        self.update_attributes({default_user_role_id: admin_role.id})
    end

    def create_platforms
        IosPlatform.create(account_id: self.id, title: self.title)
        AndroidPlatform.create(account_id: self.id, title: self.title)
    end


end
