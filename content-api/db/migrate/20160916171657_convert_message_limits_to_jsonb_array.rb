class ConvertMessageLimitsToJsonbArray < ActiveRecord::Migration

    def up
        add_column :accounts, :message_limits_jsonb, :jsonb, array: true, default: []
        add_column :message_templates, :limits_jsonb, :jsonb, array: true, default: []
        
        Account.all.each do |account|
            next if account.message_limits.nil? || account.message_limits.empty?
            json = account.message_limits.map(&:dump)
            account.update_column(:message_limits_jsonb, json)
        end

        MessageTemplate.where("limits IS NOT NULL").each do |template|
            next if template.limits.nil? || template.limits.empty?
            json = template.limits.map(&:dump)
            puts template.limits_jsonb
            template.update_column(:limits_jsonb, json)
        end

        remove_column :accounts, :message_limits
        rename_column :accounts, :message_limits_jsonb, :message_limits

        remove_column :message_templates, :limits
        rename_column :message_templates, :limits_jsonb, :limits
    end

    def down
        add_column :accounts, :message_limits_hstore, :hstore, array: true
        add_column :message_templates, :limits_hstore, :hstore, array: true

        Account.all.each do |account|
            next if account.message_limits.nil? || account.message_limits.empty?
            hstore = account.message_limits.map(&:dump)
            account.update_column(:message_limits_hstore, hstore)
        end

        MessageTemplate.where("limits IS NOT NULL").each do |template|
            next if template.limits.nil? || template.limits.empty?
            hstore = template.limits.map(&:dump)
           	template.update_column(:limits_hstore, hstore)
        end

        remove_column :accounts, :message_limits
        rename_column :accounts, :message_limits_hstore, :message_limits

        remove_column :message_templates, :limits
        rename_column :message_templates, :limits_hstore, :limits

    end
end