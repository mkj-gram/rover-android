module LandingPageBuilder
    module Actions
        class ActionBuilder

            class << self

                def new(args)
                    case args["type"]
                    when "website-action"
                        Actions::WebsiteAction.new(args)
                    when "deep-link-action"
                        Actions::DeepLinkAction.new(args)
                    else
                        Actions::Action.new(args)
                    end
                end
            end

        end
    end
end
