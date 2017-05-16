module CustomerFilter
    module Comparers
        module Methods
            EQUAL = "equal".freeze
            NOT_EQUAL = "not_equal".freeze
            STARTS_WITH = "start_with".freeze
            ENDS_WITH = "ends_with".freeze
            CONTAINS = "contains".freeze
            DOES_NOT_CONTAIN = "does_not_contain".freeze
            ANY_VALUE = "any_value".freeze
            UNKNOWN_VALUE = "unknown_value".freeze
            LESS_THAN = "less_than".freeze
            GREATER_THAN = "greater_than".freeze
            LESS_THAN_OR_EQUAL = "less_than_or_equal".freeze
            GREATER_THAN_OR_EQUAL = "greater_than_or_equal".freeze
            RANGE = "range".freeze
            IN = "in".freeze
            GEOFENCE = "geofence".freeze
            EXISTS = "exists".freeze
            DOES_NOT_EXIST = "does_not_exist".freeze
        end
    end
end
