class AddXenioFiltersToMessageTemplates < ActiveRecord::Migration
    
    def change
        add_column :message_templates, :filter_xenio_zone_tags, :string, array: true, default: []
        add_column :message_templates, :filter_xenio_zone_ids, :integer, array: true, default: []

        add_column :message_templates, :filter_xenio_place_tags, :string, array: true, default: []
        add_column :message_templates, :filter_xenio_place_ids, :integer, array: true, default: []
    end

end
