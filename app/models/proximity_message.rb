class ProximityMessage < ActiveRecord::Base
    include FormattableMessage

    message_attribute :message


    def within_schedule(current_time)
        # needs to check the start_time end_time
        # needs to check days of week
        # needs to check time of day
        true
    end

    def apply_configuration_filters(configuration)
        # needs to check to see if the filters pass
        true
    end

    def apply_customer_filters(customer, device)
        # this can be a module since it will be used in push messages
        # and experiences
        # need a common way to store these filters
        true
    end

end
