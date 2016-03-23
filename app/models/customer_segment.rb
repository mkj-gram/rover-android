class CustomerSegment < ActiveRecord::Base
    include CustomerFilter::Attribute

    segment_attribute :filters

    before_create :calculate_customers_count

    before_save :calculate_customers_count
    belongs_to :account


    def self.update_all_customer_counts_async
        UpdateCustomerSegmentsCountWorker.preform_async
    end

    def within_segment(customer, device)
        self.filters.all?{|filter| filter.within_filter(customer: customer, device: device)}
    end

    def update_customers_count!
        previous_count = self.approximate_customers_count
        calculate_customers_count
        new_count = self.approximate_customers_count
        if new_count != previous_count
            self.save
            Rails.logger.info("Customer Segment: #{self.id}, previous segment size: #{previous_count}, new segment size: #{new_count}")
        end
    end

    def customers_count
        if filters.nil? || filters.empty?
            return account.customers_count
        else
            return self.approximate_customers_count
        end
    end


    def calculate_customers_count
        if filters.nil? || filters.empty?
            self.approximate_customers_count ||= account.customers_count
        elsif changes.include?(:filters)
            self.approximate_customers_count = CustomerFilter.compute_filter_count(self.account, self.filters)
        end
    end




end
