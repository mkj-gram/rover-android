# Mongoid.logger.level = Logger::DEBUG
# Mongo::Logger.logger.level = Logger::DEBUG
# 
if Rails.env.production?
    config = {
        ssl: true,
        ssl_ca_cert_string: ENV["MONGODB_SSL_CERT"],
        uri: ENV["MONGODB_URI"]
    }
else
  config = {
      ssl: false,
      uri: "mongodb://localhost:27017/rover-local"
  }
end


defaults = {
    ssl: false,
    connect_timeout: 10,
    socket_timeout: 5,
    max_pool_size: 5,
    min_pool_size: 1,
    wait_queue_timeout: 5,
    ssl_ca_cert: nil,
    monitoring: true
}

mongo_config = (defaults.merge(config)).symbolize_keys

uri = mongo_config.delete(:uri)

$mongo = Mongo::Client.new(uri, mongo_config)
$mongo.subscribe(Mongo::Monitoring::COMMAND, MongoInstrumenter::Monitoring.new) if Rails.env.production?
