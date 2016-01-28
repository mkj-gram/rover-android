module PageHelper

    def current_page
        @current_page ||= params.has_key?(:page) && params[:page].has_key?(:number) ? params[:page][:number].to_i + 1 : 1
    end

    def current_cursor(default)
        @current_cursor ||= params.has_key?(:page) && params[:page].has_key?(:cursor) ? params[:page][:cursor] : default
    end

    def page_size
        @page_size ||= params.has_key?(:page) && params[:page].has_key?(:size) ? params[:page][:size].to_i : 50
    end

    def get_next_cursor(objects, cursor_sort_column)
        if objects.length < page_size + 1
            return nil
        else
            return objects.last[cursor_sort_column]
        end
    end

    def pagination_links(resource_url, results, opts = {})
        start_at = opts.fetch(:start_at, 1)
        links = {
            first: resource_url + "?" + pagination_query(start_at, page_size),
            last: resource_url + "?" + pagination_query(results.total_pages, page_size)
        }

        if results.next_page != nil && results.next_page != current_page
            links.merge!(
                {
                    next: resource_url + "?" + pagination_query(results.next_page, page_size)
                }
            )
        end
        if current_page > start_at
            links.merge!(
                {
                    prev: resource_url + "?" + pagination_query(current_page - 1, page_size)
                }
            )
        end
        return links
    end


    private

    def pagination_query(number, size)
        {page: {number: number, size: size}}.to_query
    end
end
