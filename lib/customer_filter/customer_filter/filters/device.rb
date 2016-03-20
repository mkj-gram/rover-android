module CustomerFilter
    module Filters
        class Device < Filter

            # field :locale_lang, type: String
            # field :locale_region, type: String
            # field :time_zone, type: String
            # field :sdk_version, type: String
            # field :platform, type: String
            # field :os_name, type: String
            # field :os_version, type: String
            # field :model, type: String
            # field :manufacturer, type: String
            # field :carrier, type: String
            # field :background_enabled, type: Boolean
            # field :local_notifications_enabled, type: Boolean
            # field :remote_notifications_enabled, type: Boolean
            # field :bluetooth_enabled, type: Boolean
            # field :location_monitoring_enabled, type: Boolean
            @@attribute_index = {
                "locale-lang" => :string,
                "locale-region" => :string,
                "time-zone" => :string,
                "sdk-version" => :string,
                "os-name" => :string,
                "os-version" => :string,
                "model" => :string,
                "manufacturer" => :string,
                "background-enabled" => :boolean,
                "local_notifications-enabled" => :boolean,
                "remote_notifications-enabled" => :boolean,
                "bluetooth-enabled" => :boolean,
                "location-monitoring-enabled" => :boolean
            }

            def model_name
                "device"
            end

            def attribute_index
                @@attribute_index
            end

            def initialize(opts)
                super
                if opts.has_key?("comparer")
                    @comparer = CustomerFilter::Comparers.build_with_type(opts["comparer"], attribute_index[attribute_name])
                end
            end

            def elasticsearch_query
                if @comparer
                    return @comparer.get_elasticsearch_query(attribute_name)
                else
                    {}
                end
            end

            def within_filter(opts = {})
                device = opts[:device]
                if device.is_a?(::CustomerDevice)
                    value = get_value_for(device)
                    comparer.check(value)
                else
                    Rails.logger.warn("Attempted to check if #{device.class.name} existed within a device segment")
                    false
                end
            end

        end
    end
end
