module UniqueRecord
    extend ActiveSupport::Concern

    included do
        before_create :enforce_unique_record
    end

    protected

    def enforce_unique_record
        old_record = self.existing_record
        if !old_record.nil?
            old_record.destroy!
        end
    end
end
