module PageHelper

    def current_page
        @current_page ||= params.has_key?(:page) && params[:page].has_key?(:number) ? params[:page][:number].to_i : 1
    end

    def current_cursor
        @current_cursor ||= params.has_key?(:page) && params[:page].has_key?(:cursor) ? params[:page][:cursor].to_i : 0
    end
    def page_size
        @page_size ||= params.has_key?(:page) && params[:page].has_key?(:size) ? params[:page][:size].to_i : 15
    end

    def get_next_cursor(objects, cursor_sort_column)
        if objects.length < page_size + 1
            return nil
        else
            return objects.last[cursor_sort_column]
        end
    end

end
