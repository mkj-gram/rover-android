class AddCertificateMetaToIosPlatforms < ActiveRecord::Migration
    def change
        add_column :ios_platforms, :certificate_expires_at, :datetime
        add_column :ios_platforms, :certificate_filename, :string
    end
end
