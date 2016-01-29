class IBeaconRegion < ActiveRecord::Base
    # self.inheritance_column = :_type_disabled
    self.table_name = BeaconConfiguration.table_name
    self.column_names([:uuid, :major, :minor])
    default_scope { where(type: "IBeaconConfiguration") }
    after_initialize :set_id

    def readonly?
        true
    end

    private

    def set_id
        p "setting id to #{self.uuid}"
        self.id = "self.uuid"
    end
end
