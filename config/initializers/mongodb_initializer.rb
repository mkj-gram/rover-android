if Rails.env.development?
    Mongoid.logger.level = Logger::DEBUG
    Mongo::Logger.logger.level = Logger::DEBUG
end
