class ProximityMessage < ActiveRecord::Base
    include FormattableMessage

    message_attribute :message

end
