class V1::GoogleIntegrationErrorSerializer < ModelError::Serializer
    attribute :code
    attribute :project_id, error_key: "project-id"
end
