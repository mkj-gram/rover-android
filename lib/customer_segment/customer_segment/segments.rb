require 'customer_segment/segments/segment'
require 'customer_segment/segments/customer'
require 'customer_segment/segments/device'
module CustomerSegment
    module Segments

        class << self

            # holds a map from string to initialization class
            @@models = {
                "device" => CustomerSegment::Segments::Device,
                "customer" => CustomerSegment::Segments::Customer
            }

            def build(opts)
                model_name = opts["model"]
                if model_name && @@models.has_key?(model_name)
                    @@models[model_name].new(opts)
                else
                    nil
                end
            end
        end

    end
end
