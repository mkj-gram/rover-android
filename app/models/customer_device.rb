class CustomerDevice < ActiveRecord::Base

    belongs_to :customer

    before_create :create_customer

    validates :account_id, presence: true

    private

    def create_customer
        if customer_id.nil?
            self.customer = Customer.create(account_id: self.account_id)
        end
    end



end
