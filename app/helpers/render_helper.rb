module RenderHelper


    def render_unauthorized(title, description)
        render_errors([{title: title, description: description, status: "401"}], {status: :unauthorized})
    end

    def render_errors(errors, opts = {})
        if errors.is_a?(ActiveModel::Errors)
            render_active_model_errors(errors, opts)
        else
            render_internal_errors(errors, opts)
        end
    end

    private

    def render_internal_errors(errors, opts = {})
        status = option(opts, :status, :unprocessable_entity)
        if errors.is_a?(Hash)
            errors = [errors]
        end
        render json: {errors: errors}, status: status
    end

    def render_active_model_errors(error, opts = {})
        status = option(opts, :status, :unprocessable_entity)
        messages = error.messages
        errors = messages.map{|title, error| {title: title.to_s, description: error.first} }
        render json: {errors: errors}, status: status
    end

end
