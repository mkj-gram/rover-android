class String

    def to_bool
        if self == "true"; return true; end
        if self == "false"; return false; end
        return nil
    end
end
