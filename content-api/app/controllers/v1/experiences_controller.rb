class V1::ExperiencesController < V1::ApplicationController

    before_action :authenticate, except: [:short_url]
    before_action :set_experience, only: [:show, :update, :publish, :revert, :archive, :unarchive ]

    allow :admin, :server, :sdk, only: [:show]
    allow :admin, :server, only: [:index, :create, :update, :publish, :revert, :delete_version, :archive, :unarchive]

    skip_params_parsing POST: ['/v1/experiences/*', '/experiences/*'], PATCH: ['/v1/experiences/*', '/experiences/*']

    def index

        # query type is it published or archived?

        must_filter = [{ term: { account_id: current_account.id }}]
        must_filter += query_collection_type if query_collection_type

        if query_keyword
            query = {
                fields: [],
                query: {
                    filtered: {
                        query: {
                            match_phrase: {
                                title: query_keyword
                            }
                        },
                        filter: {
                            bool: {
                                must: must_filter
                            }
                        }
                    }
                },
                sort: [
                    {
                        updated_at: {
                            order: 'desc'
                        }
                    }
                ]

            }
        else
            query = {
                fields: [],
                filter: {
                    bool: {
                        must: must_filter
                    }
                },
                sort: [
                    {
                        updated_at: {
                            order: 'desc'
                        }
                    }
                ]

            }
        end

        search_query = Elasticsearch::Model.search(query, [Experiences::Experience])
        results = search_query.per_page(page_size).page(current_page).results

        experience_ids = results.map { |doc| doc._id }

        experiences = Experiences::Experience.find_all(experience_ids)

        if sparse_fieldset.any? && !sparse_fieldset.include?(:screens)
            load_version_document = false
        else
            load_version_document = true
        end


        data = []

        if load_version_document
            version_ids = experiences.map{|experience| experience.current_version_id ? experience.current_version_id : experience.live_version_id }
            versions_by_experience_id = Experiences::VersionedExperience.find_all(version_ids).index_by(&:experience_id)

            experiences.each do |experience|
                version = versions_by_experience_id[experience._id]
                data.push(serialize_experience(experience, version, { fields: sparse_fieldset }))
            end
        else
            experiences.each do |experience|
                data.push(serialize_experience(experience, nil, { fields: sparse_fieldset }))
            end
        end

        render json: Oj.dump(
            {
                data: data,
                meta: {
                    totalDrafts: current_account.experiences_draft_count,
                    totalPublished: current_account.experiences_published_count,
                    totalArchived: current_account.experiences_archived_count,
                    totalRecords: results.total,
                    totalPages: results.total_pages
                }
        })
    end

    def show
        version_id = params[:version_id] || "live"
        if version_id == 'live' || version_id == @experience.live_version_id.to_s
            if stale?(last_modified: @experience.live_version_updated_at)
                render_experience(@experience, version_id)
            end
        else
            render_experience(@experience, version_id)
        end
    end

    def create

        input = raw_params.dig(:data, :attributes)
        input[:screens] = [] if input[:screens].nil?

        if input[:screens].length >= 1
            validation = validate_input(UPDATE_SCHEMA, input)
        else
            validation = validate_input(CREATE_SCHEMA, input)
        end

        if validation[:errors].any?
            render json: { errors: validation[:errors] }, status: :bad_request
            Rails.logger.warn("validation.experiences_controller action=create errors=#{validation[:errors]}")
        else
            @experience = Experiences::Experience.new(experience_params(formatted_params))
            @experience.current_version = Experiences::VersionedExperience.new(versioned_experience_params(formatted_params))
            @experience.current_version.experience_id = @experience._id

            @experience.account_id = current_account.id

            if @experience.save && @experience.current_version.save

                json = {
                    data: serialize_experience(@experience, @experience.current_version)
                }

                render json: Oj.dump(json)

            else
                head :internal_server_error
            end
        end
    end

    def update
        # The meat
        version_id = params[:version_id] || 'current'

        if version_id == 'live' || version_id == @experience.live_version_id
            render json: { errors: ['Cannot update the current live version'] }, status: 422
            return
        end

        input = raw_params.dig(:data, :attributes)
        input[:screens] = [] if input[:screens].nil?

        validation = validate_input(UPDATE_SCHEMA, input)
        if validation[:errors].any?
            render json: { errors: validation[:errors] }, status: :bad_request
            Rails.logger.warn("validation.experiences_controller action=update errors=#{validation[:errors]}")
        else
            updates = experience_params(formatted_params)
            updates.each do |k,v|
                @experience[k] = v
            end

            if version_id == 'current' || version_id == @experience.current_version_id
                if @experience.current_version.nil?
                    @experience.current_version = Experiences::VersionedExperience.new(versioned_experience_params(formatted_params))
                    @experience.current_version.experience_id = @experience._id
                    @experience.current_version_updated_at = Time.zone.now
                    @version = @experience.current_version
                else
                    versioned_experience = Experiences::VersionedExperience.new(versioned_experience_params(formatted_params))
                    @experience.current_version.merge!(versioned_experience)
                    @experience.current_version_updated_at = Time.zone.now
                    @version = @experience.current_version
                end
            else
                @version = Experiences::VersionedExperience.find(version_id)
                if @version.experience_id != @experience._id
                    @version = nil
                else
                    versioned_experience = Experiences::VersionedExperience.new(versioned_experience_params(formatted_params))
                    @version.merge!(versioned_experience)
                end
            end

            if @version
                if @version.save && @experience.save
                    render_experience(@experience, @version.id)
                else
                    head :internal_server_error
                end
            else
                head :not_found
            end
        end
    end

    def publish
        version_id = params[:version_id]

        if version_id == 'live' || version_id == @experience.live_version_id
            render json: { errors: ["version is already live"] }, status: 422
            return
        end

        if version_id == 'current'
            version_id = @experience.current_version_id
        end

        version = Experiences::VersionedExperience.find(version_id)

        if version
            @experience.live_version_id = version._id
            @experience.live_version_updated_at = Time.zone.now
            @experience.is_published = true

            if version_id == @experience.current_version_id
                @experience.current_version_id = nil
                @experience.current_version_updated_at = Time.zone.now
            end

            version.screens.each { |screen| screen["has_unpublished_changes"] = false }
            
            if version.save && @experience.save
                current_account.reload
                render_expereince_with_meta(@experience, version_id)
            else
                 head :internal_server_error
             end
           
        else
            render json: { errors: ["version does not exist"] }, status: 404
        end
    end

    def revert
        # revert is only for the current version
        # ideally a delete to /experiences/:id/:version_id would just delete the version
        
        if @experience.current_version_id && !@experience.live_version_id.nil?
            if @experience.drop_current_version
                @experience.current_version_updated_at = Time.zone.now
                if @experience.save
                    render_experience(@experience, @experience.live_version_id)
                else
                    head :internal_server_error
                end
            else
                head :internal_server_error
            end
        else
            render json: { errors: ["nothing to revert"] }, status: :unprocessable_entity
        end
    end

    def delete_version
        
        version_id = params[:version_id]

        if version_id == 'live' || version_id == @experience.live_version_id
            render json: { errors: ["cannot delete live version"] }, status: 422
            return
        end

        if version_id == 'current'
            version_id = @experience.current_version_id
        end

        version = Experiences::VersionedExperience.find(version_id)

        if version.experience_id != @experience._id
            render json: { errors: ["version does not belong to this experience"] }, status: 422
            return
        end

        if version
            if version_id == @experience.current_version_id
                @experience.current_version_updated_at = Time.zone.now
                @experience.current_version_id = nil
            end

            if version.destroy && @experience.save
                render_experience(@experience, @expereince.live_version_id)
            else
                head :internal_server_error
            end

        else
            render json: { errors: ["version does not exist"] }, status: 404
        end
    end

    def archive
        @experience.is_archived = true
        if @experience.save
            current_account.reload
            live_version = @experience.current_version_id.nil? ? true : false
            render_expereince_with_meta(@experience, live_version)
        else
            head :internal_server_error
        end
    end

    def unarchive
        @experience.is_archived = false
        if @experience.save
            current_account.reload
            live_version = @experience.current_version_id.nil? ? true : false
            render_expereince_with_meta(@experience, live_version)
        else
            head :internal_server_error
        end
    end

    def short_url
        @experience = Experiences::Experience.find_by(short_url: params[:short_url])

        version_id = params[:version] || params[:version_id] || "live"

        if @experience.nil?
            head :not_found
            return
        end

        if version_id != "live"
            view_token = params[:viewToken] || params[:view_token]
            if view_token.nil? || view_token != @experience.view_token
                head :forbidden 
                return
            end
        end

        if version_id == "current"
            last_modified = @experience.current_version_updated_at

        elsif version_id == "live"
            expires_in 1.minute, public: true
            last_modified = @experience.live_version_updated_at
        else
            experience_version = @experience.get_version(version_id)
            last_modified = experience_version.nil? ? nil : experience_version.updated_at
        end

        if stale?(last_modified: last_modified)
            render_experience(@experience, version_id, { exclude_fields: [:"view-token"] })
        end
    end


    private

    def get_cname(experience)
        if !current_account.nil? && current_account.id == experience.account_id 
            return current_account.cname
        else
            account = Account.find(experience.account_id)
            return account ? account.cname : nil
        end
    end

    def get_subdomain(experience)
        if !current_account.nil? && current_account.id == experience.account_id
            return current_account.subdomain
        else
            account = Account.find(experience.account_id)
            return account ? account.subdomain : nil
        end
    end

    def render_expereince_with_meta(experience, live_version = true)
        live_version = @experience.current_version_id.nil? ? true : false
        version_id = live_version ? experience.live_version_id : experience.current_version_id
        version = Experiences::VersionedExperience.find(version_id)
        data = {
            data: serialize_experience(experience, version),
            meta: {
                totalDrafts: current_account.experiences_draft_count,
                totalPublished: current_account.experiences_published_count,
                totalArchived: current_account.experiences_archived_count
            }
        }
        
        render json: Oj.dump(data)
    end

    def render_experience(experience, version_id, opts = {})

        if version_id == 'current'
            version_id = experience.current_version_id || experience.live_version_id
        elsif version_id == 'live'
            version_id = experience.live_version_id
        end

        Librato.timing('experience.render.time') do

            version = Experiences::VersionedExperience.find(version_id)

            if version
                data = {
                    data: serialize_experience(experience, version, opts)
                }
                
                render json: Oj.dump(data) 
            else 
                head :not_found
            end
        end
    end

    def sparse_fieldset
        @sparse_fieldset ||= (params.dig(:fields, :experiences) || "".freeze).split(",").map(&:to_sym) || []
    end

    def query_keyword
        params.dig(:filter, :query)
    end

    def query_collection_type
        type = params.dig(:filter, :collectionType)
        case type
        when "drafts"
            [
                {
                    term: {
                        is_archived: false
                    }
                },
                {
                    term: {
                        is_published: false
                    }
                }
            ]
        when "published"
            [
                {
                    term: {
                        is_archived: false
                    }
                },
                {
                    term: {
                        is_published: true
                    }
                }
            ]
        when "archived"
            [
                {
                    term: {
                        is_archived: true
                    }
                }
            ]
        else
            nil
        end
    end


    def set_experience
        @experience = Experiences::Experience.find(params[:id])
        head :not_found and return if @experience.nil?
        head :forbidden and return if @experience.account_id != current_account.id
    end


    def serialize_experience(experience, version, opts = {})
        cname = get_cname(experience)

        if !cname.nil?
            # don't use the subdomain when we are using a cname
            subdomain = nil
        else
            subdomain = get_subdomain(experience)
        end
        
        return V1::ExperienceSerializer.serialize(experience, version, subdomain, cname, opts)
    end

    def formatted_params
        @formatted_params ||= -> {
            data = raw_params.dig(:data, :attributes) || {}
            ActionController::Parameters.new(data.deep_transform_keys {|key| key = key.to_s.underscore })
        }.call
    end

    def experience_params(local_params)
        convert_param_if_exists(local_params, :name, :title)
        local_params.permit(:title, :is_published, :is_archived)
    end

    def versioned_experience_params(local_params)
        # return local_params
        data = {
            screens: (local_params[:screens] || []).map{|screen| screen_params(screen)},
            custom_keys: local_params[:custom_keys] || {},
            home_screen_id: local_params[:home_screen_id]
        }

        if data[:home_screen_id].nil?
            data[:home_screen_id] = data[:screens].is_a?(Array) && data[:screens].first.is_a?(Hash) ? data[:screens].first[:id] : nil
        end

        return data
    end

    def color_params(color)
        {
            red: color[:red],
            green: color[:green],
            blue: color[:blue],
            alpha: color[:alpha]
        }
    end

    def unit_params(unit)
        {
            type: unit[:type],
            value: unit[:value].to_f
        }
    end

    def offset_params(offset)
        {
            top: unit_params(offset[:top]),
            left: unit_params(offset[:left]),
            right: unit_params(offset[:right]),
            bottom: unit_params(offset[:bottom]),
            center: unit_params(offset[:center]),
            middle: unit_params(offset[:middle])
        }
    end

    def alignment_params(alignment)
        {
            horizontal: alignment[:horizontal],
            vertical: alignment[:vertical]
        }
    end


    def inset_params(inset)
        {
            top: inset[:top],
            left: inset[:left],
            right: inset[:right],
            bottom: inset[:bottom]
        }
    end

    def action_params(action)
        return nil if action.nil?

        data = {
            type: action[:type]
        }

        case action[:type]
        when 'go-to-screen'
            data.merge!({ screen_id: action[:screen_id], experience_id: @experience.id })
        when 'open-url'
            data.merge!({ url: action[:url] })
        end

        return data
    end

    def image_params(image)
        return nil if image.nil?
        return {
            height: image[:height],
            width: image[:width],
            type: image[:type],
            name: image[:name],
            size: image[:size],
            url: image[:url]
        }
    end

    def screen_params(local_params)
        screen = {
            id: local_params[:id],
            experience_id: @experience.id,
            name: local_params[:name],
            background_color: color_params(local_params[:background_color]),
            title: local_params[:title],
            title_bar_text_color: color_params(local_params[:title_bar_text_color]),
            title_bar_background_color: color_params(local_params[:title_bar_background_color]),
            title_bar_button_color: color_params(local_params[:title_bar_button_color]),
            title_bar_buttons: local_params[:title_bar_buttons],
            status_bar_style: local_params[:status_bar_style],
            status_bar_auto_color: local_params.has_key?(:status_bar_auto_color) ? local_params[:status_bar_auto_color] : true,
            use_default_title_bar_style: local_params[:use_default_title_bar_style],
            has_unpublished_changes: local_params.has_key?(:has_unpublished_changes) ? local_params[:has_unpublished_changes] : false,
            background_image: image_params(local_params[:background_image]),
            custom_keys: local_params[:custom_keys],
            rows: (local_params[:rows] || []).map{|row| row_params(row)}
        }

        if local_params[:status_bar_color].nil?
            color = local_params[:title_bar_background_color]
            h, s, l = ::ColorConverter.rgbToHsl(color[:red], color[:green], color[:blue])
            l = [ l - 0.1, 0].max
            r, g, b = ::ColorConverter.hslToRgb(h,s,l)
            local_params[:status_bar_color] = { red: r, green: g, blue: b, alpha: 1}
        end

        screen[:status_bar_color] = color_params(local_params[:status_bar_color])

        if screen[:background_image]
            screen.merge!({
                background_content_mode: local_params.has_key?(:background_content_mode) ? local_params[:background_content_mode] : 'original',
                background_scale: local_params.has_key?(:background_scale) ? Integer(local_params[:background_scale]) : 1
            })
        end

        return screen
    end

    def row_params(local_params)
        row = {
            id: local_params[:id],
            screen_id: local_params[:screen_id],
            experience_id: @experience.id,
            name: local_params[:name],
            auto_height: local_params[:auto_height],
            height: unit_params(local_params[:height]),
            background_color: color_params(local_params[:background_color]),
            background_image: image_params(local_params[:background_image]),
            is_collapsed: local_params[:is_collapsed].nil? ? false : local_params[:is_collapsed],
            custom_keys: local_params[:custom_keys],
            blocks: (local_params[:blocks] || []).map{ |block| block_params(block) }.compact
        }

        if row[:background_image]
            row.merge!({
                background_content_mode: local_params.has_key?(:background_content_mode) ? local_params[:background_content_mode] : 'original',
                background_scale: local_params.has_key?(:background_scale) ? Integer(local_params[:background_scale]) : 1
            })
        end

        return row
    end

    def block_params(local_params)
        case local_params[:type]
        when Experiences::Block::TEXT_BLOCK_TYPE
            return text_block_params(local_params)
        when Experiences::Block::BUTTON_BLOCK_TYPE
            return button_block_params(local_params)
        when Experiences::Block::IMAGE_BLOCK_TYPE
            return image_block_params(local_params)
        when Experiences::Block::DEFAULT_BLOCK_TYPE
            return default_block_params(local_params)
        when Experiences::Block::WEB_VIEW_BLOCK_TYPE
            return web_view_block_params(local_params)
        when Experiences::Block::BARCODE_BLOCK_TYPE
            return barcode_block_params(local_params)
        else
            nil
        end
    end

    def base_block_params(local_params)
        base_block = {
            id: local_params[:id],
            row_id: local_params[:row_id],
            screen_id: local_params[:screen_id],
            experience_id: @experience.id,
            name: local_params[:name],
            width: unit_params(local_params[:width]),
            type: local_params[:type],
            height: unit_params(local_params[:height]),
            position: local_params[:position],
            offset: offset_params(local_params[:offset]),
            alignment: alignment_params(local_params[:alignment]),
            inset: inset_params(local_params[:inset]),
            background_image: image_params(local_params[:background_image]),
            opacity: local_params.has_key?(:opacity) ? local_params[:opacity].to_f : 1.0,
            custom_keys: local_params[:custom_keys],
            lock_status: local_params[:lock_status]
        }

        if base_block[:background_image]
            base_block.merge!({
                background_content_mode: local_params.has_key?(:background_content_mode) ? local_params[:background_content_mode] : 'original',
                background_scale: local_params.has_key?(:background_scale) ? Integer(local_params[:background_scale]) : 1
            })
        end

        return base_block
    end

    def text_block_params(local_params)
        return base_block_params(local_params).merge(
            {
                auto_height: local_params[:auto_height],
                background_color: color_params(local_params[:background_color]),
                border_color: color_params(local_params[:border_color]),
                border_width: local_params[:border_width],
                border_radius: local_params[:border_radius],
                text_color: color_params(local_params[:text_color]),
                text_font: local_params[:text_font],
                text_alignment: local_params[:text_alignment],
                text: local_params[:text]
            }
        )
    end

    def button_state_params(local_params)
        return {
            background_color: color_params(local_params[:background_color]),
            border_color: color_params(local_params[:border_color]),
            border_width: local_params[:border_width],
            border_radius: local_params[:border_radius],
            text_color: color_params(local_params[:text_color]),
            text_font: local_params[:text_font],
            text_alignment: local_params[:text_alignment],
            text: local_params[:text]
        }
    end

    def button_block_params(local_params)
        return base_block_params(local_params).merge(
            {
                states: {
                    normal: button_state_params(local_params[:states][:normal]),
                    highlighted: button_state_params(local_params[:states][:highlighted]),
                    disabled: button_state_params(local_params[:states][:disabled]),
                    selected: button_state_params(local_params[:states][:selected])
                },
                action: action_params(local_params[:action])
            }
        )
    end

    def image_block_params(local_params)
        return base_block_params(local_params).merge(
            {
                auto_height: local_params[:auto_height],
                background_color: color_params(local_params[:background_color]),
                border_color: color_params(local_params[:border_color]),
                border_width: local_params[:border_width],
                border_radius: local_params[:border_radius],
                image: image_params(local_params[:image]),
                action: action_params(local_params[:action])
            }
        )
    end

    def default_block_params(local_params)
        return base_block_params(local_params).merge(
            {
                background_color: color_params(local_params[:background_color]),
                border_color: color_params(local_params[:border_color]),
                border_width: local_params[:border_width],
                border_radius: local_params[:border_radius]
            }
        )
    end

    def web_view_block_params(local_params)
        return default_block_params(local_params).merge(
            {
                url: local_params[:url],
                scrollable: local_params.has_key?(:scrollable) ? local_params[:scrollable] : true
            }
        )
    end

    def barcode_block_params(local_params)
        return image_block_params(local_params).merge(
            {
                barcode_type: local_params[:barcode_type],
                barcode_text: local_params[:barcode_text],
                barcode_scale: local_params[:barcode_scale]
            }
        )
    end


    def raw_params
        @raw_params ||= Oj.load(request.raw_post).with_indifferent_access
    end


    #############################
    # JSON experience validator #
    #############################
    JSONObject = lambda { |schema|
        lambda do |input|
            if input.is_a?(Hash)
                begin
                    ClassyHash.validate(input, schema)
                    return true
                rescue Exception => e
                    puts "BAD JSONObject"
                    e.message
                end
            else
                "an object"
            end
        end
    }

    COLOR_SCHEMA = JSONObject.(
        {
            'red' => 0..255,
            'green' => 0..255,
            'blue' => 0..255,
            'alpha' => 0.0..1.0
        }
    )

    STATUS_BAR_SCHEMA  = CH::G.enum('dark', 'light')

    UNIT_SCHEMA = JSONObject.(
        {
            'type' => CH::G.enum('points', 'percentage'),
            'value' => [ Integer, Float ] # should all be floats
        }
    )

    OFFSET_SCHEMA = {
        'top' => UNIT_SCHEMA,
        'left' => UNIT_SCHEMA,
        'right' => UNIT_SCHEMA,
        'bottom' => UNIT_SCHEMA,
        'center' => UNIT_SCHEMA,
        'middle' => UNIT_SCHEMA
    }

    ALIGNMENT_SCHEMA = {
        'horizontal' => String,
        'vertical' => String
    }

    INSET_SCHEMA = {
        'top' => [ Integer, Float ], # should all be floats ,
        'left' => [ Integer, Float ], # should all be floats ,
        'right' => [ Integer, Float ], # should all be floats ,
        'bottom' => [ Integer, Float ] # should all be floats
    }

    FONT_SCHEMA = {
        'size' => Integer,
        'weight' => Integer
    }

    ACTION_SCHEMA = lambda { |value|
        if value.is_a?(Hash)
            case value[:type]
            when 'open-url'.freeze
                schema = URL_ACTION_SCHEMA
            when 'go-to-screen'.freeze
                schema = SCREEN_ACTION_SCHEMA
            else
                return "a valid action, recieved #{value[:type]}"
            end

            begin
                ClassyHash.validate(value, schema)
                return true
            rescue => e
                return e.message
            end
        elsif value.nil?
            return true
        else
            "action object"
        end
    }

    URL_ACTION_SCHEMA = {
        'type' => CH::G.enum('open-url'),
        'url' => String
    }


    SCREEN_ACTION_SCHEMA = {
        'type' => CH::G.enum('go-to-screen'),
        'screen-id' => String
    }

    BLOCKS_SCHEMA = lambda do |value|
        if value.is_a?(Hash)
            case value[:type] || value["type"]
            when 'default-block'
                schema = DEFAULT_BLOCK_SCHEMA
            when 'image-block'
                schema = IMAGE_BLOCK_SCHEMA
            when 'button-block'
                schema = BUTTON_BLOCK_SCHEMA
            when 'text-block'
                schema = TEXT_BLOCK_SCHEMA
            when 'web-view-block'
                schema = WEB_VIEW_BLOCK_SCHEMA
            when 'barcode-block'
                schema = BARCODE_BLOCK_SCHEMA
            else
                puts "unknown type"
                return "a block, unknown 'type' => #{value[:type]}"
            end

            if value["background-image"]
                schema = schema.merge({
                    'background-content-mode' => CH::G.enum('original', 'stretch', 'tile', 'fill', 'fit'),
                    'background-scale' => CH::G.enum(1,2,3)
                })
            end

            begin
                ClassyHash.validate(value, schema)
                return true
            rescue => e
                puts "BAD BLOCK"
                return e.message
            end
        else
            # error message
            return "an object"
        end
    end

    CUSTOM_KEYS_SCHEMA = ->(custom_keys){ custom_keys.is_a?(Hash) && custom_keys.all? {|k,v| v.is_a?(String) } || ":custom-keys is not a flat key value object" }

    IMAGE_SCHEMA = {
        'height' => Integer,
        'width' => Integer,
        'type' => String,
        'name' => String,
        'size' => Integer,
        'url' => String
    }

    BASE_BLOCK_SCHEMA = {
        'id' => String,
        'row-id' => String,
        'screen-id' => String,
        'name' => String,
        'width' => UNIT_SCHEMA,
        'height' => UNIT_SCHEMA,
        'position' => CH::G.enum('stacked', 'floating'),
        'offset' => OFFSET_SCHEMA,
        'alignment' => ALIGNMENT_SCHEMA,
        'inset' => INSET_SCHEMA,
        'background-image' => [:optional, NilClass, IMAGE_SCHEMA ],
        'opacity' => [:optional, 0.0..1.0],
        'custom-keys' => CUSTOM_KEYS_SCHEMA,
        'local-status' => [:optional, NilClass, CH::G.enum("partial", "locked") ]
    }


    DEFAULT_BLOCK_SCHEMA = BASE_BLOCK_SCHEMA.merge(
        {
            'background-color' => COLOR_SCHEMA,
            'border-color' => COLOR_SCHEMA,
            'border-width' => Integer,
            'border-radius' => Integer
        }
    )

    TEXT_BLOCK_SCHEMA = BASE_BLOCK_SCHEMA.merge(
        {
            'type' => CH::G.enum('text-block'),
            'auto-height' => [ TrueClass, FalseClass ],
            'background-color' => COLOR_SCHEMA,
            'border-color' => COLOR_SCHEMA,
            'border-width' => Integer,
            'border-radius' => Integer,
            'text-color' => COLOR_SCHEMA,
            'text-font' => FONT_SCHEMA,
            'text-alignment' => CH::G.enum('left', 'right', 'center'),
            'text' => String
        }
    )

    IMAGE_BLOCK_SCHEMA = BASE_BLOCK_SCHEMA.merge(
        {
            'type' => CH::G.enum('image-block'),
            'auto-height' => [ TrueClass, FalseClass ],
            'background-color' => COLOR_SCHEMA,
            'border-color' => COLOR_SCHEMA,
            'border-width' => Integer,
            'border-radius' => Integer,
            'image' => [ :optional, NilClass, IMAGE_SCHEMA]
        }
    )

    BUTTON_STATE_SCHEMA = {
        'background-color' => COLOR_SCHEMA,
        'border-color' => COLOR_SCHEMA,
        'border-width' => Integer,
        'border-radius' => Integer,
        'text-color' => COLOR_SCHEMA,
        'text-font' => FONT_SCHEMA,
        'text-alignment' => CH::G.enum('left', 'right', 'center'),
        'text' => String
    }

    BUTTON_BLOCK_SCHEMA = BASE_BLOCK_SCHEMA.merge(
        {
            'type' => CH::G.enum('button-block'),
            'states' => {
                'normal' => BUTTON_STATE_SCHEMA,
                'highlighted' => BUTTON_STATE_SCHEMA,
                'disabled' => BUTTON_STATE_SCHEMA,
                'selected' => BUTTON_STATE_SCHEMA
            },
            'action' => [:optional, NilClass, ACTION_SCHEMA]
        }
    )

    WEB_VIEW_BLOCK_SCHEMA = DEFAULT_BLOCK_SCHEMA.merge(
        {
            'type' => CH::G.enum('web-view-block'),
            'url' => /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/,
            'scrollable' => [:optional, TrueClass, FalseClass]
        }
    )

    BARCODE_BLOCK_SCHEMA = DEFAULT_BLOCK_SCHEMA.merge(
        {
            'type' => CH::G.enum('barcode-block'),
            'barcode-type' => CH::G.enum('code128', 'hibcpdf417', 'azteccode', 'qrcode', 'upca'),
            'barcode-text' => String,
            'image' => IMAGE_SCHEMA
        }
    )

    ROW_BASE_SCHEMA = {
        'id' => String,
        'screen-id' => String,
        'name' => String,
        'auto-height' => [ TrueClass, FalseClass ],
        'background-color' => COLOR_SCHEMA,
        'height' => UNIT_SCHEMA,
        'background-image' => [:optional, NilClass, IMAGE_SCHEMA ],
        'is-collapsed' => [ TrueClass, FalseClass ],
        'custom-keys' => CUSTOM_KEYS_SCHEMA,
        'blocks' => [[ BLOCKS_SCHEMA ]],

    }

    ROWS_SCHEMA = lambda { |value|  
        schema = ROW_BASE_SCHEMA
        if value["background-image"]
            schema = schema.merge({
                'background-content-mode' => CH::G.enum('original', 'stretch', 'tile', 'fill', 'fit'),
                'background-scale' => CH::G.enum(1,2,3)
            })
        end

        begin
            ClassyHash.validate(value, schema)
            return true
        rescue => e
            puts "BAD ROW"
            return e.message
        end
    }

    BASE_SCREEN_SCHEMA = {
        'id' => String,
        'background-color' => COLOR_SCHEMA,
        'title' => [:optional, NilClass, String],
        'title-bar-text-color' => COLOR_SCHEMA,
        'title-bar-background-color'=> COLOR_SCHEMA,
        'title-bar-button-color' => COLOR_SCHEMA,
        'title-bar-buttons' => CH::G.enum('close', 'back', 'both', 'none'),
        'status-bar-style' => STATUS_BAR_SCHEMA,
        'status-bar-color' => [:optional, COLOR_SCHEMA],
        'status-bar-auto-color' => [:optional, TrueClass, FalseClass ],
        'use-default-title-bar-style'=> [ TrueClass, FalseClass ],
        'has-unpublished-changes' => [:optional, TrueClass, FalseClass],
        'background-image' => [:optional, NilClass, IMAGE_SCHEMA ],
        'custom-keys' => CUSTOM_KEYS_SCHEMA,
        'rows' => [[ ROWS_SCHEMA ]]
    }


    SCREEN_SCHEMA = lambda { |value| 
        schema = BASE_SCREEN_SCHEMA
        if value["background-image"]
            schema = schema.merge({
                'background-content-mode' => CH::G.enum('original', 'stretch', 'tile', 'fill', 'fit'),
                'background-scale' => CH::G.enum(1,2,3)
            })
        end

        begin
            ClassyHash.validate(value, schema)
            return true
        rescue => e
            puts "BAD SCREEN"
            return e.message
        end
    }


    CREATE_SCHEMA = {
        'name' => String,
        'screens' => [[ SCREEN_SCHEMA ]]
    }

    UPDATE_SCHEMA = {
        'name' => String,
        'home-screen-id' => String,
        'custom-keys' => CUSTOM_KEYS_SCHEMA,
        'screens' => [[ SCREEN_SCHEMA ]]
    }

    def validate_input(schema, input)
        begin
            ClassyHash.validate(input, schema)
            return {errors: []}
        rescue => e
            puts e.message
            return { errors: [e.message] }
        end
    end



end
