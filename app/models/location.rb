class Location < ActiveRecord::Base

    belongs_to :account, counter_cache: true

    has_many :beacon_configurations


end
