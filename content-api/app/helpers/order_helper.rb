module OrderHelper


    #
    # Takes in an array of values which can be sorted and returns an SQL compliant query
    # @param list [Array] [array of values that are allowed to be ordered]
    #
    # @return [String] [SQL Query]
    def whitelist_order(list, default = nil, opts = {})
        forced_order = opts.fetch(:order, nil)

        data = params.has_key?(:order) ? params[:order] : []
        if data.is_a?(String)
            data = data.split(",")
        end
        orders = data.map{|d| Order.new(d)}
        orders.delete_if{|order| !list.include?(order.key)}
        orders.delete_if{|order| order.order != forced_order } if !forced_order.nil?
        if orders.empty? && !default.nil?
            return default
        else
            return orders.map{|order| order.statement}
        end
    end

    private


    class Order

        attr_reader :key, :order, :statement

        def initialize(value)
            if value.first == "-"
                @order = "DESC"
                @key = value.length == 1 ? "" : value[1, value.length]
                @statement = "#{@key} #{@order}"
            else
                @key = value
                @statement = @key
            end
        end
    end


end
