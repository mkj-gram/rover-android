class CreateActiveConfigurationUuids < ActiveRecord::Migration
    def change
        create_table :active_configuration_uuids do |t|
            t.integer :account_id
            t.string :type
            t.string :configuration_uuids, array: true, default: []
        end

        add_index :active_configuration_uuids, :account_id
        add_index :active_configuration_uuids, [:account_id, :type]
    end
end
