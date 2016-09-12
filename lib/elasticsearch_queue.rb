module ElasticsearchQueue

    @lock = Mutex.new
    @queue = {}
    @timer = nil

    class << self

        def index(index: , type: , id: , version: , body: )
            @lock.synchronize do
                @queue[id] = {
                    index: { _index: index, _type: type, _id: id, _version: version, _version_type: 'external' },
                    body: body
                }
            end
        end

        def delete(index: , type: , id: , version: )
            @lock.synchronize do
                @queue[id] = {
                    delete: { _index: index, _type: type, _id: id, _version: version, _version_type: 'external' }
                }
            end
        end

        def start
            if @timer.nil?
                Rails.logger.info("ElasticsearchQueue started".green.bold)
                @timer = Concurrent::TimerTask.new(execution_interval: 10, timeout_interval: 5) do
                    ElasticsearchQueue.flush
                end
                @timer.execute
            end
        end

        def stop
            if @timer
                Rails.logger.info("ElasticsearchQueue stopped".green.bold)
                @timer.shutdown
                @timer = nil
            end
        end

        def flush

            flush_queue = nil

            @lock.synchronize do
                flush_queue = @queue
                @queue = {}
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
            Rails.logger.debug(bulk)
            client = Elasticsearch::Model.client

            response = client.bulk(body: bulk)

            Rails.logger.info("Bulk Response: #{response}".green.bold)
        end

    end

end