class AddSha256CertFingerprintsToAndroidPlatforms < ActiveRecord::Migration
    
    def change
        add_column :android_platforms, :sha256_cert_fingerprints, :string, array: true
    end

end
