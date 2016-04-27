# Mongoid.logger.level = Logger::DEBUG
# Mongo::Logger.logger.level = Logger::DEBUG
config = Rails.configuration.mongo.with_indifferent_access

defaults = {
    ssl: false,
    connect_timeout: 10,
    socket_timeout: 5,
    max_pool_size: 5,
    min_pool_size: 1,
    wait_queue_timeout: 5,
    ssl_ca_cert: nil
}

mongo_config = (config.merge(defaults)).symbolize_keys
uri = mongo_config.delete(:uri)

$mongo = Mongo::Client.new(uri, mongo_config)


$mongo[Customer.collection_name].indexes.create_many(
    [
        { :key => { :account_id =>  1, :"devices._id" => 1}, :unique => true, :partial_filter_expression => { :"devices._id" => { :"$exists" => true } } },
        { :key => { :account_id =>  1, :identifier => 1 }, :unique => true, :partial_filter_expression => { :"identifier" => { :"$exists" => true } } },
        { :key => { :"devices.token" => 1 }, :unique => true, :partial_filter_expression => { :"devices.token" => { :"$exists" => true } } }
    ]
)

$mongo[Message.collection_name].indexes.create_many(
    [
        { :key => { :expire => 1 }, :sparse => true, :expire_after_seconds => 0}
    ]
)


# create all indexes
# customers
# index({"account_id": 1, "devices._id": 1}, {unique: true,partial_filter_expression {"devices._id" => {"$exists" => true}}})
# index({"account_id": 1, "identifier": 1},  {unique: true,partial_filter_expression {"identifier" => {"$exists" => true}}})
# index({"account_id": 1, "traits": 1}, partial_filter_expression {"traits" => {"$exists" => true}}})
# index({"devices.token": 1}, {unique: true,partial_filter_expression {"devices.token" => {"$exists" => true}}})
#
# messages
# # index({ expire_at: 1 }, { sparse: true,  expire_after_seconds: 0 })
