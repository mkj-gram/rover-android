module IncludeHelper
    def whitelist_include(list)
        data = params.has_key?(:include) ? params[:include] : []
        if data.is_a?(String)
            data = data.split(",")
        end
        data.delete_if{|d| !list.include?(d)}
        return data
    end
end
