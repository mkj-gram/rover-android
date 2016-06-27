module CustomerDeviceHelper
	
	class << self
		
		def remove_tokens(tokens)
			return if tokens.nil? || tokens.empty?
			customers = Customer.find_all_by("devices.token" => {"$in" => tokens})
			customers.map(&:devices).flatten.each do |device| 
				device.token = nil
				device.remote_notifications_enabled = false
			end
			customers.each { |customer| customer.save }
		end

	end

end