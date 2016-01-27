class Hash

    def dig(*path)
        path.inject(self) do |location, key|
            location.is_a?(Hash) ? location[key] : nil
        end
    end

end
