module PageHelper

    def current_page
        @current_page ||= params.has_key?(:page) && params[:page].has_key?(:number) ? params[:page][:number].to_i : 1
    end

    def page_size
        @page_size ||= params.has_key?(:page) && params[:page].has_key?(:size) ? params[:page][:size].to_i : 20
    end

end
