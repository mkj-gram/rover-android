module PushConnectionCache

    @apns_development_connection_cache = {}
    @apns_production_connection_cache = {};
    @fcm_connection_cache = {}

    @master_lock = Mutex.new

    class << self

        # connections expire every hour and will be setup again
        def with_apns_connection(account_id, development: false, expires_in: 300)
            # first lock by account_id

            connection_context = @apns_connection_cache[account_id]

            if connection_context.nil?
                connection_context = create_apns_connection!(account_id, development, expires_in)
            elsif connection_context[:expires_at] < Time.zone.now
                # Apns Kit uses threads that we must shutdown before recreating the client
                connection_context[:connection].shutdown
                connection_context = create_apns_connection!(account_id, development, expires_in)
            end


            if block_given?
                begin
                    if connection_context.nil?
                        yield nil
                    else
                        connection_context[:lock].synchronize do
                            yield connection_context
                        end
                    end
                end
            end

        end

        def with_fcm_connection(account_id, expires_in: 3600)
            connection_context = @fcm_connection_cache[account_id]

            if connection_context.nil? || connection_context[:expires_at] < Time.zone.now
                connection_context = create_fcm_connection!(account_id, expires_in)
            end

            if block_given?
                begin
                    if connection_context.nil?
                        yield nil
                    else
                        connection_context[:lock].synchronize do
                            yield connection_context
                        end
                    end
                end
            end

        end


        private

        def create_apns_connection!(account_id, development, expires_in)
            @master_lock.synchronize do
                Rails.logger.info("Setting up APNS connection cache for account #{account_id} development: #{development}")
                platform = IosPlatform.where(account_id: account_id).first
                return if platform.certificate.nil?
                connection = ApnsHelper.connection_from_ios_platform(platform, development: development, heartbeat_interval: 60)
                if development == true
                    return @apns_development_connection_cache[account_id] = {
                        platform: platform,
                        connection: connection,
                        expires_at: Time.zone.now + expires_in,
                        lock: Mutex.new
                    }
                else
                    return @apns_production_connection_cache[account_id] = {
                        platform: platform,
                        connection: connection,
                        expires_at: Time.zone.now + expires_in,
                        lock: Mutex.new
                    }
                end
            end
        end

        def create_fcm_connection!(account_id, expires_in)
            @master_lock.synchronize do
                Rails.logger.info("Setting up FCM connection cache for account #{account_id}")
                platform = AndroidPlatform.where(account_id: account_id).first
                return if platform.api_key.nil?
                connection = FCM.new(platform.api_key)
                @fcm_connection_cache[account_id] = {
                    platform: platform,
                    connection: connection,
                    expires_at: Time.zone.now + expires_in,
                    lock: Mutex.new
                }
                return @fcm_connection_cache[account_id]
            end
        end

    end
end
