module ElasticsearchQueue

    @flush_interval = 10
    @queue = Hash.new
    @lock = Mutex.new
    @scheduler = nil

    class << self

        def index(index: , type: , id: , version: , body: )
            start!
            @lock.synchronize do
                @queue[id] = {
                    index: { _index: index, _type: type, _id: id, _version: version, _version_type: 'external' },
                    body: body
                }
            end
        end

        def delete(index: , type: , id: , version: )
            start!
            @lock.synchronize do
                @queue[id] = {
                    delete: { _index: index, _type: type, _id: id, _version: version, _version_type: 'external' }
                }
            end
        end

        def start!
            if @scheduler.nil?
                @lock.synchronize do
                    if @scheduler.nil?
                        Rails.logger.info("ElasticsearchQueue started".green.bold)
                        @scheduler = Concurrent::TimerTask.new(execution_interval: 10, timeout_interval: 5) do
                            self.flush!
                        end
                        @scheduler.execute
                    end
                end
            end
        end

        def stop!
            if @scheduler
                @scheduler.shutdown
            end
        end

        def flush!

            flush_queue = nil

            @lock.synchronize do
                flush_queue = @queue
                @queue = Hash.new
            end

            if flush_queue.empty?
                return
            end

            Rails.logger.info("Flushing ElasticsearchQueue".green.bold)

            bulk = []

            flush_queue.each do |k,v|
                if v[:index]
                    bulk.push({
                                index: v[:index]
                    })
                    bulk.push(v[:body])
                elsif v[:delete]
                    bulk.push({
                                delete: v[:delete]
                    })
                end
            end

            if bulk.length == 0
                return
            end

            Rails.logger.info("Sending bulk request to Elasticsearch".green.bold)
            
            client = Elasticsearch::Model.client

            response = client.bulk(body: bulk)

            Rails.logger.info("Bulk Response: #{response}".green.bold)
        end
    end

end