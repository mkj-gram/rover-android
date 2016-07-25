class DasherizeLandingPages < ActiveRecord::Migration
    def up

        Rails.logger.info("Updating Templates")

        MessageTemplate.where.not(landing_page_template: nil).find_in_batches(batch_size: 100) do |templates|
            templates.each do |message_template|
                message_template.update_column(:landing_page_template, Oj.dump(message_template.landing_page.as_json.deep_transform_keys{|key| key.gsub(/\_/, "-")}))
            end
        end

        Rails.logger.info("Updating rendered messages")

        Message.all_in_batches.each_slice(1000) do |messages|
            messages.each do |message|
                next if message.landing_page.nil? || message.landing_page.as_json.nil?
                converted_landing_page = message.landing_page.as_json.deep_transform_keys{|key| key.gsub(/\_/, "-")}
                message.update_attribute({"landing_page" =>  converted_landing_page})
            end
        end

    end


    def down
        Rails.logger.info("Updating Templates")

        MessageTemplate.where.not(landing_page_template: nil).find_in_batches(batch_size: 100) do |templates|
            templates.each do |message_template|
                message_template.update_column(:landing_page_template, Oj.dump(message_template.landing_page.as_json.deep_transform_keys{|key| key.gsub(/\-/, "_")}))
            end
        end

        Rails.logger.info("Updating rendered messages")

        Message.all_in_batches.each_slice(1000) do |messages|
            messages.each do |message|
                next if message.landing_page.nil? || message.landing_page.as_json.nil?
                converted_landing_page = message.landing_page.as_json.deep_transform_keys{|key| key.gsub(/\-/, "_")}
                message.update_attribute({"landing_page" =>  converted_landing_page})
            end
        end
    end
end
