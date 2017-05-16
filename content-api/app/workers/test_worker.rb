class TestWorker
    include BackgroundWorker::Worker

    from_queue 'test_worker'


    def self.perform_async()

        enqueue_message({}, {to_queue: 'test_worker'})
    end

    def perform(args)
        puts "Thanks"
        MetricsClient.queue.add(:temperature => 32.2, source: "test")
        ack!
    end

end
