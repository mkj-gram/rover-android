module VirtusDirtyAttributes
    extend ActiveSupport::Concern

    class Undefined
    end

    included do

        def initialize(atr = {})
            super atr
            @_original_attributes = (to_doc).deep_dup
            @_new_record = atr[:new_record].nil? ? true : atr[:new_record]
        end

        def ori
            return @_original_attributes
        end

        def changes
            new_attributes = to_doc
            changed = new_attributes.inject({}) do |hash, (k,v)|
                if v.is_a?(Array)
                    hash.merge!(k => [@_original_attributes[k], v]) if @_original_attributes[k].sort_by { |a| a.hash } != v.sort_by { |a| a.hash }
                else
                    hash.merge!(k => [@_original_attributes[k], v]) if @_original_attributes[k] != v
                end
                hash
            end

            (ori.keys - new_attributes.keys).each do |key|
                changed[key] = [ @_original_attributes[key], Undefined ]
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
