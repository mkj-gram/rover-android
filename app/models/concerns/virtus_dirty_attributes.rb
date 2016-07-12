module VirtusDirtyAttributes
    extend ActiveSupport::Concern

    included do

        def initialize(atr = {})
            super atr
            @_original_attributes = to_doc
            @_new_record = atr[:new_record].nil? ? true : atr[:new_record]
        end

        def ori
            return @_original_attributes
        end

        def changes
            changed = to_doc.inject({}) do |hash, (k,v)|
                if v.is_a?(Array)
                    if v.first.is_a?(Hash)
                        sort_key = v.first.keys.first
                        hash.merge!(k => [@_original_attributes[k], v]) if @_original_attributes[k].sort_by{|e| e[sort_key]} != v.sort_by{|e| e[sort_key]}
                    else
                        hash.merge!(k => [@_original_attributes[k], v]) if @_original_attributes[k].sort != v.sort
                    end
                else
                    hash.merge!(k => [@_original_attributes[k], v]) if @_original_attributes[k] != v
                end
                hash
            end
            return changed || {}
        end

        def changes_applied
            @_original_attributes = to_doc
        end

        def new_record?
            @_new_record
        end

        def new_record=(val)
            @_new_record = val
        end

    end

end
