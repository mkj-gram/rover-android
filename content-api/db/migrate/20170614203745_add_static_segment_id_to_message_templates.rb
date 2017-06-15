class AddStaticSegmentIdToMessageTemplates < ActiveRecord::Migration
    def change
        add_column :message_templates, :static_segment_id, :integer 
    end
end
