class V1::ExperiencesController < V1::ApplicationController

    before_action :authenticate, except: [:short_url]
    before_action :set_experience, only: [:show, :update, :publish, :revert ]

    def index

        # query type is it published or archived?

        must_filter = [{ term: { account_id: current_account.id }}]
        must_filter += query_collection_type if query_collection_type

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

        search_query = Elasticsearch::Model.search(query, [Experiences::Experience])
        results = search_query.per_page(page_size).page(current_page).results

        experience_ids = results.map { |doc| doc._id }

        experiences = Experiences::Experience.find_all(experience_ids)

        data = []
        included = []
        version_ids = experiences.map{|experience| experience.current_version_id ? experience.current_version_id : experience.live_version_id }
        versions_by_experience_id = Experiences::VersionedExperience.find_all(version_ids).index_by(&:experience_id)

        experiences.each do |experience|
            version = versions_by_experience_id[experience._id]
            data.push(serialize_experience(experience, version))
        end

        render json: Oj.dump(
            {
                data: {
                    experiences: data
                },
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

        if params[:version] == 'current'
            live_version = @experience.current_version_id.nil? ? true : false
            last_modified = live_version ? @experience.live_version_updated_at : @experience.current_version_updated_at
        else
            last_modified = @experience.live_version_updated_at
            live_version = true
        end

        if stale?(last_modified: last_modified)
            render_experience(@experience, live_version )
        end

    end

    def create

        input = raw_params.dig(:data, :experience)
        input[:screens] = [] if input[:screens].nil?

        validation = validate_input(input)

        if validation[:errors].any?
            render json: { errors: validation[:errors] }, status: :bad_request
        else
            @experience = Experiences::Experience.new(experience_params(formatted_params))
            @experience.account_id = current_account.id
            versioned_experience = Experiences::VersionedExperience.new(versioned_experience_params(formatted_params))
            if @experience.save
                versioned_experience.experience_id = @experience._id
                if versioned_experience.save
                    @experience.current_version = versioned_experience
                    if @experience.update_attribute(:current_version_id, versioned_experience._id)
                        render_experience(@experience, false)
                    else
                        head :internal_server_error
                    end
                else
                    head :internal_server_error
                end
            else
                head :internal_server_error
            end
        end
    end

    def update
        # The meat

        input = raw_params.dig(:data, :experience)
        input[:screens] = [] if input[:screens].nil?

        validation = validate_input(input)
        if validation[:errors].any?
            render json: { errors: validation[:errors] }, status: :bad_request
        else
            updates = experience_params(formatted_params)
            updates.each do |k,v|
                @experience[k] = v
            end

            if @experience.current_version.nil?
                @experience.current_version = Experiences::VersionedExperience.new(versioned_experience_params(formatted_params))
                @experience.current_version.experience_id = @experience._id
            else
                versioned_experience = Experiences::VersionedExperience.new(versioned_experience_params(formatted_params))
                @experience.current_version.merge!(versioned_experience)
            end

            if @experience.current_version.save
                @experience.current_version_updated_at = Time.zone.now
                if @experience.save
                    render_experience(@experience, false)
                else
                    head :internal_server_error
                end
            else
                head :internal_server_error
            end
        end
    end

    def publish
        if @experience.current_version_id
            @experience.live_version_id = @experience.current_version_id
            @experience.current_version_id = nil
            @experience.live_version_updated_at = Time.zone.now
            @experience.current_version_updated_at = Time.zone.now
            if @experience.save
                render_experience(@experience, false)
            else
                head :internal_server_error
            end
        else
            render json: { errors: ["nothing to publish"] }, status: :unprocessable_entity
        end
    end

    def revert
        if @experience.current_version_id
            if @experience.drop_current_version
                @experience.current_version_updated_at = Time.zone.now
                if @experience.save
                    render_experience(@experience, true)
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

    def short_url
        @experience = Experiences::Experience.find_by(short_url: params[:short_url])
        if @experience
            if stale?(last_modified: @experience.live_version_updated_at)
                render_experience(@experience)
            end
        else
            head :not_found
        end
    end


    private

    def render_experience(experience, live_version = true)
        Librato.timing('experience.render.time') do

            version = live_version ? experience.live_version : experience.current_version
            if version.nil?
                head :not_found
            else
                version = live_version ? experience.live_version : experience.current_version

                json = {
                    data: {
                        experience: serialize_experience(experience, version)
                    }
                }

                render json: Oj.dump(json)
            end

        end
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


    def serialize_experience(experience, version)
        Rails.cache.fetch("/experiences/#{experience.id}/version/#{version.id}/#{version.updated_at.to_i}-serialize-cache") do
            V1::ExperienceSerializer.serialize(experience, version)
        end
    end

    def formatted_params
        @formatted_params ||= -> {
            data = raw_params.dig(:data, :experience) || {}
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
            screens: (local_params[:screens] || []).map{|screen| screen_params(screen)}
        }

        data[:home_screen_id] = local_params[:home_screen_id] || data[:screens].is_a?(Array) && data[:screens].first.is_a?(Hash) ? data[:screens].first[:id] : nil

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

        data = {
            type: action[:type]
        }

        case action[:type]
        when 'go-to-screen'
            data.merge!({ screen_id: action[:screen_id], experience_id: action[:experience_id] })
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
        return {
            id: local_params[:id],
            experience_id: @experience.id,
            name: local_params[:name],
            background_color: color_params(local_params[:background_color]),
            title_bar_text_color: color_params(local_params[:title_bar_text_color]),
            title_bar_background_color: color_params(local_params[:title_bar_background_color]),
            status_bar_style: local_params[:status_bar_style],
            use_default_title_bar_style: local_params[:use_default_title_bar_style],
            has_unpublished_changes: local_params.has_key?(:has_unpublished_changes) ? local_params[:has_unpublished_changes] : false,
            rows: (local_params[:rows] || []).map{|row| row_params(row)}
        }
    end

    def row_params(local_params)
        return {
            id: local_params[:id],
            screen_id: local_params[:screen_id],
            experience_id: @experience.id,
            name: local_params[:name],
            auto_height: local_params[:auto_height],
            height: unit_params(local_params[:height]),
            background_color: color_params(local_params[:background_color]),
            blocks: local_params[:blocks] || []
        }
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
        else
            {}
        end
    end

    def base_block_params(local_params)
        return {
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
            inset: inset_params(local_params[:inset])
        }
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
            text: text
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
                action: action_params(local_param[:action])
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
                image: image_params(local_params[:image])
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
            else
                puts "unknown type"
                return "a block, unknown 'type' => #{value[:type]}"
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
        'inset' => INSET_SCHEMA
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
            'image' => [ :optional, NilClass,
                         {
                             'height' => Integer,
                             'width' => Integer,
                             'type' => String,
                             'name' => String,
                             'size' => Integer,
                             'url' => String
            }]
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

    ROWS_SCHEMA = {
        'id' => String,
        'screen-id' => String,
        'name' => String,
        'auto-height' => [ TrueClass, FalseClass ],
        'background-color' => COLOR_SCHEMA,
        'height' => UNIT_SCHEMA,
        'blocks' => [[ BLOCKS_SCHEMA ]]
    }

    SCREEN_SCHEMA = {
        'id' => String,
        'background-color' => COLOR_SCHEMA,
        'title-bar-text-color' => COLOR_SCHEMA,
        'title-bar-background-color'=> COLOR_SCHEMA,
        'status-bar-style'=> STATUS_BAR_SCHEMA,
        'use-default-title-bar-style'=> [ TrueClass, FalseClass ],
        'has-unpublished-changes' => [:optional, TrueClass, FalseClass],
        'rows' => [[ ROWS_SCHEMA ]]
    }

    SCHEMA = {
        'name' => String,
        'screens' => [[ SCREEN_SCHEMA ]]
    }

    def validate_input(input)
        begin
            ClassyHash.validate(input, SCHEMA)
            return {errors: []}
        rescue => e
            puts e.message
            return { errors: [e.message] }
        end
    end



end
