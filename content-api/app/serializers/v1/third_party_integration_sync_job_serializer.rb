class V1::ThirdPartyIntegrationSyncJobSerializer
    class << self

        def serialize_with_integration(job, integration)
            json = serialize(job)
            json["relationships"] = {
                "integration" => {
                    "data" => {"type" => integration.model_type, "id" => integration.id.to_s}
                }
            }
            json
        end

        def serialize(job)
            {
                "type" => job.model_type,
                "id" => job.id.to_s,
                "attributes" => {
                    "status" => job.status,
                    "started-at" => job.started_at,
                    "finished-at" => job.finished_at,
                    "error-message" => job.error_message,
                    "created-at" => job.created_at
                }.merge(job.stats_attributes.dasherize || {})
            }
        end

    end
end
