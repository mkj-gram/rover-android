class UpdateActiveTagsWorker
    include BackgroundWorker::Worker

    from_queue 'update_active_tags'

    def self.perform_async(account_id, tag_type, lookup_class, old_tags, new_tags)
        msg = {account_id: account_id, tag_type: tag_type, lookup_class: lookup_class, old_tags: old_tags, new_tags: new_tags}.to_json
        enqueue_message(msg, {to_queue: 'update_active_tags'})
    end

    def work(msg)
        payload = JSON.parse(msg)
        account_id = payload["account_id"]
        tag_type = payload["tag_type"]
        lookup_class = payload["lookup_class"].camelize.constantize
        old_tags = payload["old_tags"]
        new_tags = payload["new_tags"]

        old_tags.each do |tag|
            if !lookup_class.where(account_id: account_id).where("tags @> ?", "{#{tag}}").exists?
                # don't need to read the model just delete it
                ActiveTags.where(account_id: account_id, type: tag_type, tag: tag).delete_all
            end
        end

        new_tags.each do |tag|
            begin
                ActiveTags.create(account_id: account_id, type: tag_type, tag: tag)
            rescue ActiveRecord::RecordNotUnique => e
                Rails.logger.warn("Tag already exists #{tag}")
                Rails.logger.warn("Message: #{e.message}")
            end
        end

        ack!
    end
end
