class Message < ActiveRecord::Base

    belongs_to :account, counter_cache: true
    before_save :update_archived_messages_count




    private

    def update_messages_count
        if archived == true && archived_was == false
            Account.update_counters(self.account_id, archived_messages_count: 1)
        elsif archived == false && archived_was == true
            Account.update_counters(self.account_id, archived_messages_count: -1)
        end

    end

end
