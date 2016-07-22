module LandingPageHelper
	    class << self

        def defaults!(parent, attribute, fallback)
            parent[attribute] = fallback if parent[attribute].nil?
            return nil
        end

        def set_defaults!(landing_page)
            p "loading defaults for"
            p landing_page
            defaults!(landing_page, "rows", [])
            landing_page["rows"].each { |row| set_row_defaults!(row)}
            defaults!(landing_page, "background-color", { "red" => 255, "green" => 255, "blue" => 255, "alpha" => 1.0 })
            defaults!(landing_page, "title-bar-text-color", { "red" => 0, "green" => 0, "blue" => 0, "alpha" => 1.0 })
            defaults!(landing_page, "title-bar-background-color", { "red" => 255, "green" => 255, "blue" => 255, "alpha" => 1.0 })
            defaults!(landing_page, "title-bar-button-color", { "red" => 0, "green" => 122, "blue" => 255, "alpha" => 1.0 })
            landing_page["status-bar-style"] = 'dark' if landing_page["status-bar-style"].nil?
            landing_page["use-default-title-bar-style"] = false if landing_page["use-default-title-bar-style"].nil?
            if landing_page["status-bar-color"].nil? && landing_page["title-bar-background-color"]
                color = landing_page["title-bar-background-color"]
                h, s, l = ::ColorConverter.rgbToHsl(color["red"], color["green"], color["blue"])
                l = [ l - 0.1, 0].max
                r, g, b = ::ColorConverter.hslToRgb(h,s,l)
                landing_page["status-bar-color"] = { "red" => r, "green" => g, "blue" => b, "alpha" => 1.0 }
            end
        end

        def set_row_defaults!(row)
            defaults!(row, "height", { "type" => 'points', "value" => 0 })
            defaults!(row, "blocks", [])
            row["blocks"].each { |block| set_block_defaults!(block) }
        end

        def set_block_defaults!(block)
            defaults!(block, "type", 'block')
            defaults!(block, "width", { "type" => 'points', "value" => 170 })
            defaults!(block, "height", { "type" => 'points', "value" => 280 })
            defaults!(block, "position", 'stacked')
            defaults!(block, "alignment", { "horizontal" => 'fill', "vertical" => 'top' })
            defaults!(block, "offset", { "top" => { "type" => 'points', "value" => 20 }, "right" => { "type" => 'points', "value" => 20 }, "bottom" => { "type" => 'points', "value" => 20 }, "left" => { "type" => 'points', "value" => 20 }, "center" => { "type" => 'points', "value" => 0 }, "middle" => { "type" => 'points', "value" => 0 } })
            defaults!(block, "states", {})

            if block["type"] == 'button-block'
                states = block["states"]

                defaults!(states, "normal", {})
                defaults!(states, "highlighted", {})
                defaults!(states, "disabled", {})
                defaults!(states, "selected", {})

                set_default_button_state!(states["normal"])
                set_default_button_state!(states["highlighted"])
                set_default_button_state!(states["disabled"])
                set_default_button_state!(states["selected"])
            elsif block["type"] == 'image-block'
                set_image_block_defaults!(block)
            elsif block["type"] == 'text-block'
                set_text_block_defaults!(block)
            end
        end

        def set_has_text_defaults!(obj)
            defaults!(obj, "text", '')
            defaults!(obj, "text-alignment", { "horizontal" => 'center', "vertical" => 'middle' })
            defaults!(obj, "text-offset", { "top" => { "type" => 'points', "value" => 0 }, "right" => { "type" => 'points', "value" => 0 }, "bottom" => { "type" => 'points', "value" => 0 }, "left" => { "type" => 'points', "value" => 0 }, "center" => { "type" => 'points', "value" => 0 }, "middle" => { "type" => 'points', "value" => 0 } })
            defaults!(obj, "text-color", { "red" => 129, "green" => 129, "blue" => 129, "alpha" => 1.0 })
            defaults!(obj, "text-font", { "size" => 16, "weight" => 400 })
        end

        def set_has_border_defaults!(obj)
            defaults!(obj, "border-color", { "red" => 129, "green" => 129, "blue" => 129, "alpha" => 1.0 })
            defaults!(obj, "border-width", 1.0)
            defaults!(obj, "border-height", 0.0)
            defaults!(obj, "border-radius", 0)
        end

        def set_has_background_defaults!(obj)
            defaults!(obj, "background-color", { "red" => 238, "green" => 238, "blue" => 238, "alpha" => 1.0 })
            defaults!(obj, "background-content-mode", 'tile')
        end

        #  BUTTON BLOCKS
        def set_default_button_state!(state)
            set_has_text_defaults!(state)
            set_has_border_defaults!(state)
            set_has_background_defaults!(state)
        end

        # IMAGE BLOCKS
        def set_image_block_defaults!(block)
            set_has_background_defaults!(block)
            set_has_border_defaults!(block)
        end

        # TEXT BLOCKS
        def set_text_block_defaults!(block)
            defaults!(block, "border-width", 0)
            set_has_border_defaults!(block)
            set_has_background_defaults!(block)
            set_has_text_defaults!(block)
        end



        ##
        # Validation Rules
        ##

        def valid?(landing_page)
            errors = []
            valid =  (
                landing_page["rows"].all?{ |row| validate_row(row, errors) } &&
                validate_color(landing_page["background-color"], errors) &&
                validate_color(landing_page["title-bar-text-color"], errors) &&
                validate_color(landing_page["title-bar-background-color"], errors) &&
                validate_color(landing_page["title-bar-button-color"], errors) &&
                (landing_page["status-bar-style"] == "dark" || landing_page["status-bar-style"] == "light") &&
                validate_color(landing_page["status-bar-color"], errors)
            )
            return { "valid" => valid, "errors" => errors }
        end

        def validate_font(font, errors)
            return true
        end

        def validate_color(color, errors)
            return false if color.nil?

            valid = true

            if !(color["red"] >= 0 && color["red"] <= 255)
                errors.push("#{color} :red must be between 0 and 255")
                valid = false
            end

            if !(color["green"] >= 0 && color["green"] <= 255)
                errors.push("#{color} :green must be between 0 and 255")
                valid = false
            end

            if !(color["blue"] >= 0 && color["blue"] <= 255)
                errors.push("#{color} :blue must be between 0 and 255")
                valid = false
            end

            if !(color["alpha"] >= 0.0 && color["alpha"] <= 1.0)
                errors.push("#{color} :alpha must be between 0.0 and 1.0")
                valid = false
            end

            return valid
        end

        def validate_unit(unit, errors)
            valid = true

            if unit.nil?
                errors.push("unit cannot be null")
                return false
            end

            if unit["value"].nil?
                errors.push("#{unit} value cannot be nil")
                valid = false
            end

            if !(unit["type"] == 'points' || unit["type"] == 'percentage')
                errors.push("#{unit} unknown type")
                valid = false
            end

            return valid
        end

        def validate_alignment(alignment, errors)
            return false if alignment.nil?
            return true
        end

        def validate_offset(offset, errors)
            if offset.nil?
                errors.push("offset cannot be null")
                return false
            end

            return (
                validate_unit(offset["top"], errors) &&
                validate_unit(offset["right"], errors) &&
                validate_unit(offset["bottom"], errors) &&
                validate_unit(offset["left"], errors) &&
                validate_unit(offset["center"], errors) &&
                validate_unit(offset["middle"], errors)
            )
        end

        def validate_row(row, errors)
            return (validate_unit(row["height"], errors) && row["blocks"].all? { |block| validate_block(block, errors) })
        end

        def validate_block(block, errors)
            valid_base_block = (
                validate_unit(block["width"], errors) &&
                validate_unit(block["height"], errors) &&

                validate_alignment(block["alignment"], errors) &&
                validate_offset(block["offset"], errors)
            )

            if !(block["position"] == 'stacked' || block["position"] == 'floating')
                errors.add("#{block} position must be stacked or floating")
                return false
            end

            return false if !valid_base_block

            case block["type"]
            when 'button-block'
                return validate_button_block(block, errors)
            when 'text-block'
                return validate_text_block(block)
            when 'image-block'
                return validate_image_block(block)
            else
                return false
            end
        end

        def validate_action(action, errors)
            return true
        end

        def validate_state(state, errors)
            valid =  (
                validate_color(state["background-color"], errors) &&
                validate_alignment(state["text-alignment"], errors) &&
                validate_offset(state["text-offset"], errors) &&
                validate_color(state["text-color"], errors) &&
                validate_font(state["text-font"], errors) &&
                validate_color(state["border-color"], errors)
            )

            if state["border-width"] < 0
                errors.push("#{state} :border-width must be larger than 0")
                valid = false
            end

            if state["border-height"] < 0
                errors.push("#{state} :border-height must be larger than 0")
                valid = false
            end

            if state["border-radius"] < 0
                errors.push("#{state} :border-radius must be larger than 0")
                valid = false
            end

            return valid
        end


        def validate_button_block(button_block, errors)
            states = button_block["states"]
            return (
                validate_action(states["action"], errors) &&
                validate_state(states["normal"], errors) &&
                validate_state(states["highlighted"], errors) &&
                validate_state(states["disabled"], errors) &&
                validate_state(states["selected"], errors)
            )
        end

        def validate_text_block(text_block)
            return true
        end

        def validate_image_block(image_block)
            return true
        end
    end
end