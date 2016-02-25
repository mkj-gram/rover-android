module ElasticsearchShardCountHelper
    class << self
        @@config = Rails.configuration.elasticsearch
        # settings { number_of_shards: 1, number_of_replicas: 2 }
        def get_settings(default_settings)
            if !@@config["max_shards_per_index"].nil?
                shards_left = @@config["max_shards_per_index"].to_i
                requested_number_of_shard = default_settings[:number_of_shards] || 1
                requested_number_of_replicas = default_settings[:number_of_replicas] || 0
                new_number_of_shards = [shards_left, requested_number_of_shard].min
                shards_left = shards_left - new_number_of_shards
                new_number_of_replicas = [shards_left, requested_number_of_replicas].min
                return { number_of_shards: new_number_of_shards, number_of_replicas: new_number_of_replicas }
            else
                return default_settings
            end
        end
    end
end
