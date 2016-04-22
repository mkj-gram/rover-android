class MessageTemplateStats
    include Mongoid::Document

    field :_id, as: :message_template_id, type: Integer
    field :total_delivered, type: Integer, default: 0
    field :total_views, type: Integer, default: 0
    field :total_swipes, type: Integer, default: 0
    field :unique_views, type: Integer, default: 0
end
