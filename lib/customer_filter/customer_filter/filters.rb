require 'customer_filter/filters/filter'
require 'customer_filter/filters/customer'
require 'customer_filter/filters/device'
module CustomerFilter
    module Filters

        class << self

            # holds a map from string to initialization class
            @@models = {
                "device" => CustomerFilter::Filters::Device,
                "customer" => CustomerFilter::Filters::Customer
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
