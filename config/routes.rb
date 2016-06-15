Rails.application.routes.draw do
    # resources :account_invites, except: [:new, :edit]
    # resources :shared_beacons, except: [:new, :edit]
    # resources :shared_places, except: [:new, :edit]

    # resources :users, except: [:new, :edit]
    # resources :accounts, except: [:new, :edit]

    # scope module: :v1, constraints: ApiConstraint.new(version: 1) do
    #     resources :apps, except: [:new, :edit]
    # end
    api_version(:module => "V1", :path => {:value => "v1"}, :parameter => {:name => "version", :value => "1"}, default: true, :defaults => { :format => 'json' }) do
        # resources :accounts do
        #     scope module: "account_context" do
        #         resources :users
        #         # resources :places, :controller => ""
        #     end
        # end

        resources :accounts, only: [:show, :update]

        resources :users, except:[:create] do

            # resources :password_reset, only: [:create]
        end

        post 'registrations', to: "registrations#create"

        resources "password-resets", only: [:index, :create, :update], controller: "password_resets", :as => 'password_reset'

        resources :account_invites, only: [:index, :create, :destroy]
        get '/account_invites/:token', to: "account_invites#show"

        # resources :places do
        #     # collection do
        #     # scope module: "places" do
        #     #     collection do
        #     #         delete  '', to: "bulk#destroy",   as: "bulk_delete"
        #     #         patch   '', to: "bulk#update",    as: "bulk_update"
        #     #         post    '', to: "bulk#create",    as: "bulk_create"
        #     #     end
        #     # end

        #     # end
        #     # namespace :relationships, module: "places" do
        #     #     resources :beacons
        #     # end
        # end

        resources :places

        resources :sessions, only: [:create, :show, :destroy]

        resources "configurations", controller: "beacon_configurations", as: "beacon_configuration"

        resources "gimbal-places", controller: "gimbal_places", as: "gimbal_place", only: [:index, :show]


        resources :integrations, only: [:index, :show, :create, :update, :destroy] do
            scope module: "integrations" do
                resources "sync-jobs", controller: "sync_jobs", as: "sync_jobs", only: [:create, :show, :index]
            end
        end

        resources "estimote-integrations", controller: "integrations", as: "estimote_integrations", only: [:index, :show, :create, :update, :destroy], integration_type: "estimote-integrations" do
            scope module: "integrations" do
                resources "estimote-sync-jobs", controller: "sync_jobs", as: "sync_jobs", only: [:create, :show, :index]
            end
        end

        resources "kontakt-integrations", controller: "integrations", as: "kontakt_integrations", only: [:index, :show, :create, :update, :destroy], integration_type: "kontakt-integrations" do
            scope module: "integrations" do
                resources "kontakt-sync-jobs", controller: "sync_jobs", as: "sync_jobs", only: [:create, :show, :index]
            end
        end

        resources "gimbal-integrations", controller: "integrations", as: "gimbal_integrations", only: [:index, :show, :create, :update, :destroy], integration_type: "gimbal-integrations" do
            scope module: "integrations" do
                resources "sync-jobs", controller: "sync_jobs", as: "sync_jobs", only: [:create, :show, :index]
            end
        end

        scope module: "integrations" do
            resources :"estimote-sync-jobs", controller: "sync_jobs", as: "sync_jobs", only: [:create, :show]
            resources :"kontakt-sync-jobs", controller: "sync_jobs", as: "sync_jobs", only: [:create, :show]
            resources :"beacon-sync-jobs", controller: "sync_jobs", as: "sync_jobs", only: [:create, :show]
            resources :"google-sync-jobs", controller: "sync_jobs", as: "sync_jobs", only: [:create, :show, :index]
        end


        post "/events", to: 'events#create'

        resources :customers, only: [:index, :show]

        resources :"proximity-messages", controller: "proximity_message_templates", as: "proximity_message_templates"
        post "/proximity-messages/:id/test-message", to: 'proximity_message_templates#test_message'

        resources :"scheduled-messages", controller: "scheduled_message_templates", as: "scheduled_message_templates"

        get "/inbox", to: 'customer_inbox#show'

        get "/inbox/:id", to: 'customer_inbox_messages#show'
        patch "/inbox/:id", to: 'customer_inbox_messages#update'
        delete "/inbox/:id", to: 'customer_inbox_messages#destroy'

        get "/inbox/:id/landing-page", to: 'customer_inbox_landing_page#show'
        
        resources :"segments", controller: "customer_segments", as: "customer_segments"
        scope :segments do
            post "/calculate", to: "customer_segment_calculate#create", as: "customer_segment_calculate"
        end

        resources "ios-platforms", controller: "ios_platforms", as: "ios_platforms", only: [:show, :update] do
            post "/certificate", to: 'ios_platform_certificate#update', as: 'ios_platform_certificate'
            delete "/certificate", to: 'ios_platform_certificate#destroy', as: 'ios_platform_certificate_destroy'
        end

        resources "android-platforms", controller: "android_platforms", as: "android_platforms", except: [:index]

        resources :images, only: [:create]

        get '/google-oauth-url', to: "google_oauth#show"

        resources :"google-integrations", controller: "google_integrations", as: "google_integrations", only: [:show, :create, :update, :destroy] do
            scope module: "integrations" do
                resources "google-sync-jobs", controller: "sync_jobs", as: "sync_jobs", only: [:create, :show, :index]
            end
        end

    end
    # The priority is based upon order of creation: first created -> highest priority.
    # See how all your routes lay out with "rake routes".

    # You can have the root of your site routed with "root"
    # root 'welcome#index'

    # Example of regular route:
    #   get 'products/:id' => 'catalog#view'

    # Example of named route that can be invoked with purchase_url(id: product.id)
    #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

    # Example resource route (maps HTTP verbs to controller actions automatically):
    #   resources :products

    # Example resource route with options:
    #   resources :products do
    #     member do
    #       get 'short'
    #       post 'toggle'
    #     end
    #
    #     collection do
    #       get 'sold'
    #     end
    #   end

    # Example resource route with sub-resources:
    #   resources :products do
    #     resources :comments, :sales
    #     resource :seller
    #   end

    # Example resource route with more complex sub-resources:
    #   resources :products do
    #     resources :comments
    #     resources :sales do
    #       get 'recent', on: :collection
    #     end
    #   end

    # Example resource route with concerns:
    #   concern :toggleable do
    #     post 'toggle'
    #   end
    #   resources :posts, concerns: :toggleable
    #   resources :photos, concerns: :toggleable

    # Example resource route within a namespace:
    #   namespace :admin do
    #     # Directs /admin/products/* to Admin::ProductsController
    #     # (app/controllers/admin/products_controller.rb)
    #     resources :products
    #   end
end
