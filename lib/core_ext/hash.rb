class Hash

    def dig(*path)
        path.inject(self) do |location, key|
            location.is_a?(Hash) ? location[key] : nil
        end
    end

    def dasherize
        self.deep_transform_keys { |key| key.dasherize }
    end

    def dasherize!
        self.deep_transform_keys! { |key| key.dasherize }
    end

end
