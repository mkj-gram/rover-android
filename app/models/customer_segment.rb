class CustomerSegment < ActiveRecord::Base
    include CustomerFilter::Attribute

    segment_attribute :filters

    before_create :calculate_customers_count

    before_save :calculate_customers_count
    has_one :account


    def within_segment(customer, device)
        self.apply_customer_filters.all?{|filter| filter.within_filter(customer: customer, device: device)}
    end

    private

    def calculate_customers_count
        if filters.empty?
            self.approximate_customers_count ||= account.customers_count
        elsif changes.include?(:filters)
            self.approximate_customers_count = CustomerFilter.compute_filter_count(self.filters)
        end
    end

end
