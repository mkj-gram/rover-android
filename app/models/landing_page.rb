class LandingPage
    #
    # Type class used to load data from the db
    #
    class Type < ActiveRecord::Type::Value
        def type
            :jsonb
        end

        def type_cast_from_user(value)
            # when programmer sets the value
            if !value.nil? && value.is_a?(Hash)
                load_landing_page_from_json(value, false)
            else
                nil
            end
        end

        def type_cast_from_database(value)
            if String === value
                json = Oj.load(value) rescue nil
                load_landing_page_from_json(json, true)
            else
                super value
            end
        end

        def type_cast_for_database(value)
            if value.is_a?(LandingPage)
                value.to_json
            else
                super value
            end
        end


        def load_landing_page_from_json(json, from_db = false)
            return LandingPage.new(json, from_db)
        end

        def changed_in_place?(raw_old_value, new_value)
            return type_cast_from_database(raw_old_value).as_json != new_value.as_json
        end

    end

    def initialize(json = {}, from_db = true)
        @value = json
        @from_db = from_db
        LandingPageHelper.set_defaults!(@value) if from_db == false && !@value.nil?
    end

    def valid?
        if @value.is_a?(Hash)
            valid = LandingPageHelper.valid?(@value)
            @errors = valid[:error]
            return valid[:valid]
        elsif @value.nil?
            return true
        else
            @errors = [ "Cannot parse landing page"]
            return false
        end
    end

    def errors
        @errors || []
    end

    def ==(other)
        return false if other.nil?
        return false if !other.is_a?(LandingPage)
        return as_json == other.as_json
    end

    def as_json(opts = {})
        return @value
    end

    def to_json
        Oj.dump(as_json)
    end

end
