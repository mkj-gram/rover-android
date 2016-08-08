class V1::ExperiencesController < V1::ApplicationController

    before_action :authenticate, except: [:short_url]
    before_action :set_experience, only: [:show, :update, :destroy]

    def index

        # query type is it published or archived?

        query = {
            fields: [],
            filter: {
                term: {
                    account_id: current_account.id
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

        experiences.each do |experience|
            version = experience.current_version || experience.live_version
            data.push(V1::ExperienceSerializer.serialize(experience, version))
        end

        render json: Oj.dump({data: data })
    end

    def show

        if params[:current] == 'true'
            last_modified = @experience.current_version_updated_at
            live_version = false
        else
            last_modified = @experience.live_version_updated_at
            live_version = true
        end

        if stale?(last_modified: last_modified)
            render_experience(@experience, live_version )
        end

    end

    def create
        @experience = Experiences::Experience.new(experience_params(params))
        @experience.account_id = current_account.id
        versioned_experience = Experiences::VersionedExperience.new(versioned_experience_params(params))
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

    def update
        # The meat
        updates = experience_params(params)
        if params[:'has-unpublished-changes'] == false && @experience.current_version
            @experience.live_version = @experience.current_version
            @experience.current_version_id = nil
            current_time = Time.zone.now
            updates.merge!({ current_version_id: nil, live_version_id: @experience.live_version_id, current_version_updated_at: current_time, live_version_updated_at: current_time  })
        end

        if @experience.update_attributes(updates)
            render_experience(@experience)
        else
            render json: { error: "Haven't thought this far"}
        end

    end

    def destroy
        if Experiences::VersionedExperience.delete_all(experience_id: @experience._id) && @experience.destroy
            head :no_content
        else
            head :internal_server_error
        end
    end

    def short_url
        @experience = Experiences::Experience.find_by(short_url: params[:short_url])

        if stale?(last_modified: @experience.live_version_updated_at)
            render_experience(@experience)
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
                    data: V1::ExperienceSerializer.serialize(experience, version),
                    meta: {
                        current_version_id: experience.current_version_id.to_s,
                        live_version_id: experience.live_version_id.to_s
                    }
                }

                render json: Oj.dump(json)
            end

        end
    end


    def set_experience
        @experience = Experiences::Experience.find(params[:id])
        head :not_found and return if @experience.nil?
        head :forbidden and return if @experience.account_id != current_account.id
    end

    def modify_current_version!
        if @experience.current_version
            # TODO: implement check sum
            if  false && @experience.current_version.check_sum != params[:"checksum"] && params[:force] != true
                # return some error
                return false
            else
                @experience.current_version.merge_experience!(versioned_experience_params(params))
                if @experience.current_version.save
                    return true
                else
                    return false
                    # return some error
                end
            end
        else
            # create the versioned experience
            versioned_experience = Experiences::VersionedExperience.new(versioned_experience_params(params))
            versioned_experience.experience_id = @experience._id
            if versioned_experience.save
                if @experience.update_attribute(:current_version_id, versioned_experience._id)
                    return true
                else
                    return false
                end
            else
                return false
            end
        end

    end

    def experience_params(local_params)
        local_params.permit(:title, :published, :archived)
    end

    def versioned_experience_params(local_params)
        versioned_experience = local_params.fetch(:experience, {}).permit(
            :has_unpublished_changes,
            :published,
            :archived,
        )

        versioned_experience[:screens] = local_params[:screens] if local_params.has_key?(:screens)
        versioned_experience[:screens].map!{|screen| screen_params(screen)} if versioned_experience[:screens]
        versioned_experience.dasherize! # convert back to a dasherized document
        return versioned_experience
    end

    def color_params(local_params, fallback = { red: 255, green: 255, blue: 255, alpha: 1.0 })
        local_params = ActionController::Parameters.new(fallback) if local_params.nil?
        color = local_params.permit(:red, :green, :blue, :alpha)
        color[:red] = [255, [0, color[:red].to_i].max].min
        color[:green] = [255, [0, color[:green].to_i].max].min
        color[:blue] = [255, [0, color[:blue].to_i].max].min
        color[:alpha] = [1.0, [0.0, color[:alpha].to_i].max].min
        return color
    end

    def screen_params(local_params)
        # settings for a screen
        screen = local_params.permit(
            :id,
            :background_color,
            :title_bar_text_color,
            :title_bar_background_color,
            :title_bar_button_color,
            :status_bar_style,
            :use_default_title_bar_style,
            :status_bar_color
        )

        screen[:background_color] = color_params(screen[:background_color], { red: 255, green: 255, blue: 255, alpha: 1.0 })
        screen[:title_bar_text_color] = color_params(screen[:title_bar_text_color], { red: 0, green: 0, blue: 0, alpha: 1.0 })
        screen[:title_bar_background_color] = color_params(screen[:title_bar_background_color], { red: 255, green: 255, blue: 255, alpha: 1.0 })
        screen[:title_bar_button_color] = color_params(screen[:title_bar_button_color], { red: 0, green: 122, blue: 255, alpha: 1.0 })
        screen[:status_bar_style] = ['dark', 'light'].include?(screen[:status_bar_style]) ? screen[:status_bar_style] : 'dark'
        screen[:use_default_title_bar_style] = screen[:use_default_title_bar_style] || false

        if screen[:status_bar_color].nil? && screen[:title_bar_background_color]
            color = screen[:title_bar_background_color]
            h, s, l = ::ColorConverter.rgbToHsl(color[:red], color[:green], color[:blue])
            l = [ l - 0.1, 0].max
            r, g, b = ::ColorConverter.hslToRgb(h,s,l)
            screen[:status_bar_color] = { red: r, green: g, blue: b, alpha: 1.0 }
        end

        screen[:rows] = [] if screen[:rows].nil?
        screen[:rows] = screen[:rows].map{|row| row_params(row)}
        return screen
    end

    def row_params(local_params)
        # TODO
        # parse the screen
        return local_params
    end

    def block_params(local_params)
        # TODO
        # parse the block
        return local_params
    end


end
