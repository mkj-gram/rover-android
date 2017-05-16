class CreateStaticSegments < ActiveRecord::Migration[5.0]

    def change

        create_table :static_segments do |t|
            t.integer :account_id, null: false
            t.string :redis_set_id
            t.string :title
            t.timestamps
        end


        add_index :static_segments, :account_id
        add_index :static_segments, [:account_id, :created_at]
        add_index :static_segments, [:account_id, :updated_at]
    end

end
