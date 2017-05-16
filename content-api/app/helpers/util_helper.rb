module UtilHelper
    class << self
        def string_array_to_sql_array(array)
            input = array.map{|element| "\"#{ActiveRecord::Base.connection.quote_string(element)}\""}.join(",")
            return "'{#{input}}'"
        end
    end
end
