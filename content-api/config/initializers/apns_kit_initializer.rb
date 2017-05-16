require 'logger'
ApnsKit.logger = Logger.new(STDOUT)
ApnsKit.logger.level = Logger::INFO
