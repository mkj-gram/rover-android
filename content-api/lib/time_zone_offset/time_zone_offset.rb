module TimeZoneOffset

    class << self

        def get_time_zones_for_offset(offset)
            time_zones_in_offset = []
            TZInfo::Timezone.all.each do |time_zone|
                utc_offset = (time_zone.current_period.utc_offset + time_zone.current_period.std_offset)/60/60
                time_zones_in_offset.push(time_zone.name) if utc_offset == offset
            end
            return time_zones_in_offset
        end

    end


end
