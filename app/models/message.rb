# Messages are derived from message templates
class Message
    include Virtus.model(:nullify_blank => true)
    include ActiveModel::Validations
    include ActiveModel::Validations::Callbacks
    include VirtusDirtyAttributes
    extend ActiveModel::Naming
    extend ActiveModel::Callbacks

    attribute :_id, BSON::ObjectId, default: lambda { |model, attribute| BSON::ObjectId.new }
    attribute :customer_id, BSON::ObjectId
    attribute :message_template_id, Integer
    attribute :notification_text, String
    attribute :ios_title, String, default: ""
    attribute :android_title, String, default: ""
    attribute :ios_sound_file, String
    attribute :android_sound_file, String
    attribute :tags, Array, default: []
    attribute :read, Boolean, default: false
    attribute :viewed, Boolean, default: false
    attribute :saved_to_inbox, Boolean, default: true
    attribute :content_type, String
    attribute :website_url, String
    attribute :timestamp, Time , default: lambda { |model, attribute|  Time.zone.now }
    attribute :expire_at, Time

    alias_method :id, :_id

    define_model_callbacks :save, :create, :update, :destroy
    # index({ expire_at: 1 }, { sparse: true,  expire_after_seconds: 0 })

    # belongs_to :customer
    # belongs_to: message nope

    validates :_id, presence: true
    validates :message_template_id, presence: true
    validates :customer_id, presence: true
    validates :notification_text, presence: true
    validates :timestamp, presence: true

    before_create :set_expire
    after_create :add_to_inbox


    def self.temporary_message_expire_time
        1.month
    end

    def self.mongo_client
        $mongo
    end

    def mongo_client
        Message.mongo_client
    end

    def self.collection_name
        "messages"
    end

    def collection_name
        Message.collection_name
    end

    def to_doc
        attributes
    end

    def create
        return false if !valid?
        run_callbacks :create do
            run_callbacks :save do
                mongo_client[collection_name].insert_one(to_doc)
            end
        end
        changes_applied
    end

    def save
        return false if !valid?
        if new_record?
            create
        else
            run_callbacks :save do
                if changes.any?
                    mongo_client[collection_name].find("_id" => self._id).update_one(changes.map{|k,v|  {"$set" => { k => v.last } }})
                end
            end
            changes_applied
        end
    end

    def destroy
        run_callbacks :destroy do
            mongo_client[collection_name].delete_one("_id" => self._id)
        end
        changes_applied
    end

    def customers=(new_customer)
        @customer = new_customer
        self[:customer_id] = @customer.id
    end

    def customer
        @customer
    end

    def message_template=(template)
        @message_template = template
        self[:message_template_id] = template.id
    end

    def message_template
        @message_template ||= MessageTemplate.find_by_id(message_template_id)
    end

    def metric_type
        "message_template.root"
    end

    class << self
        def from_document(doc)
            Message.new(doc)
        end

        def self.find(id)
            doc = mongo_client[collection_name].find("_id" => BSON::ObjectId(id)).limit(1).first
            return nil if doc.nil?
            return Message.from_document(doc)
        end


        def find_all(ids)
            ids = ids.map{|id| BSON::ObjectId(id)}
            docs = mongo_client[collection_name].find("_id" => {"$in" => ids }).map{|document| Message.from_document(document) }
            return docs
        end
    end

    private

    # We expire messages which aren't saved to the inbox
    def set_expire
        if saved_to_inbox == false
            self.expire_message_at = Time.zone.now + Message.temporary_message_expire_time
        end
    end

    def add_to_inbox
        if saved_to_inbox == true
            customer.inbox.add_message(self) if customer
        end
    end

end
