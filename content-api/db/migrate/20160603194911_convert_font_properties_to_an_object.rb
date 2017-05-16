class ConvertFontPropertiesToAnObject < ActiveRecord::Migration
    def up
        results = MessageTemplate.connection.select_all("SELECT * from message_templates")
        records = results.to_hash
        records.each do |record|
            next if record["landing_page_template"].nil?
            id = record["id"]
            has_changed = false
            landing_page_hash = JSON.parse(record["landing_page_template"])
            landing_page_hash["rows"].each do |row|
                next if row["blocks"].nil?
                row["blocks"].each do |block|
                    next if block["text_font_size"].nil?
                    block["text_font"] = {
                        "size" =>  block.delete("text_font_size"),
                        "weight" => block.delete("text_font_weight")
                    }
                    has_changed = true

                end
            end

            MessageTemplate.update(id, landing_page_template: landing_page_hash) if has_changed

        end
    end

    def down
    end

end
