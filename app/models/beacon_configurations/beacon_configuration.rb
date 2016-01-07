class BeaconConfiguration < ActiveRecord::Base
    belongs_to :configurable, polymorphic: true
    belongs_to :location, counter_cache: true
    belongs_to :account, counter_cache: true
end
