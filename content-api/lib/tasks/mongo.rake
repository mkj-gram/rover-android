namespace :mongo do
    desc "Creates the indexes needed"
    task :create_indexes => :environment do
        $mongo[Customer.collection_name].indexes.create_many(
            [
                { :key => { :account_id =>  1, :"devices._id" => 1}, :unique => true, :partial_filter_expression => { :"devices._id" => { '$exists' => true } } },
                { :key => { :account_id =>  1, :identifier => 1 }, :unique => true, :partial_filter_expression => { :"identifier" => { '$exists' => true } } },
                { :key => { :"devices.token" => 1 }, :unique => true, :partial_filter_expression => { :"devices.token" => { '$exists' => true } } }
            ]
        )

        $mongo[Message.collection_name].indexes.create_many(
            [
                { :key => { :expire_at => 1 }, :sparse => true, :expire_after_seconds => 0}
            ]
        )
    end
end
