class AddSubdomainToAccounts < ActiveRecord::Migration

    def up
        add_column :accounts, :subdomain, :string
        add_index :accounts, :subdomain, unique: true

        Account.order(id: :desc).find_each(batch_size: 100) do |account|

            base_subdomain = account.title ? account.title.downcase.gsub(/\s+/, "-") : SecureRandom.hex
            subdomain = base_subdomain
            current_count = 1

            account.subdomain = loop do
                break subdomain unless Account.exists?(subdomain: subdomain)
                subdomain = base_subdomain + "#{current_count}"
                current_count += 1
            end

            account.update(subdomain: subdomain)
        end
    end


    def down
        remove_index :accounts, :subdomain
        remove_column :accounts, :subdomain
    end
end
