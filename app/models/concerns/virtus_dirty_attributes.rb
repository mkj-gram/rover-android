module VirtusDirtyAttributes
    extend ActiveSupport::Concern

    included do

        def initialize(atr = {})
            super atr
            @_original_attributes = as_json
            @_new_record = atr[:new_record].nil? ? true : atr[:new_record]
        end

        def ori
            return @_original_attributes
        end

        def changes
            changed = as_json.inject({}) do |hash, (k,v)|
                if v.is_a?(Array)
                    hash.merge!(k => [@_original_attributes[k], v]) if @_original_attributes[k].uniq != v.uniq
                else
                    hash.merge!(k => [@_original_attributes[k], v]) if @_original_attributes[k] != v
                end
                hash
            end
            return changed || {}
        end

        def changes_applied
            @_original_attributes = as_json
        end

        def new_record?
            @_new_record
        end

        def new_record=(val)
            @_new_record = val
        end

    end

end
