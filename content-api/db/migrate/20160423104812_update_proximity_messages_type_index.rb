class UpdateProximityMessagesTypeIndex < ActiveRecord::Migration
    def change
        remove_index :message_templates, name: "index_messages_on_account_id_type_published_trigger_event_id"
        add_index :message_templates, [:account_id, :type, :published, :trigger_event_id], where: "published = true AND type = 'ProximityMessageTemplate'", name: "index_published_proximity_messages_by_trigger_event_id"
    end
end
