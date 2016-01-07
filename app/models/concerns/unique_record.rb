module UniqueRecord
    extend ActiveSupport::Concern

    included do
        before_create :enforce_unique_record
    end

    protected

    def enforce_unique_record
        Rails.logger.info(self.class)
        old_record = self.existing_record
        Rails.logger.info(old_record.to_json)
        if !old_record.nil?
            old_record.destroy!
        end
    end
end
