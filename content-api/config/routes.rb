Rails.application.routes.draw do
    api_version(:module => "V1", :path => {:value => "v1"}, :parameter => {:name => "version", :value => "1"}, default: true, :defaults => { :format => 'json' }) do

        resources :accounts, only: [:show, :update]

        resources :users, except:[:create]

        post 'registrations', to: "registrations#create"

        resources "password-resets", only: [:index, :create, :update], controller: "password_resets", :as => 'password_reset'

        resources :places

        resources :sessions, only: [:create, :show, :destroy]

        resources "configurations", controller: "beacon_configurations", as: "beacon_configuration"

        resources "gimbal-places", controller: "gimbal_places", as: "gimbal_place", only: [:index, :show]
        resources "xenio-zones", controller: "xenio_zones", as: "xenio_zones", only: [:index, :show]
        resources "xenio-places", controller: "xenio_places", as: "xenio_place", only: [:index, :show]

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

        resources "xenio-integrations", controller: "integrations", as: "xenio_integrations", only: [:index, :show, :create, :update, :destroy], integration_type: "xenio-integrations" do
            scope module: "integrations" do
                resources "sync-jobs", controller: "sync_jobs", as: "sync_jobs", only: [:create, :show, :index]
            end
        end

        scope module: "integrations" do
            resources :"estimote-sync-jobs", controller: "sync_jobs", as: "sync_jobs", only: [:create, :show]
            resources :"kontakt-sync-jobs", controller: "sync_jobs", as: "sync_jobs", only: [:create, :show]
            resources :"beacon-sync-jobs", controller: "sync_jobs", as: "sync_jobs", only: [:create, :show]
            resources :"gimbal-sync-jobs", controller: "sync_jobs", as: "sync_jobs", only: [:create, :show]
            resources :"google-sync-jobs", controller: "sync_jobs", as: "sync_jobs", only: [:create, :show, :index]
            resources :"xenio-sync-jobs", controller: "sync_jobs", as: "sync_jobs", only: [:create, :show]
        end

        resources :customers, only: [:index, :show]

        resources :"proximity-messages", controller: "proximity_message_templates", as: "proximity_message_templates"

        resources :"scheduled-messages", controller: "scheduled_message_templates", as: "scheduled_message_templates"
        
        resources :"dynamic-segments", controller: "customer_segments", as: "customer_segments"
        scope :"dynamic-segments" do
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

        get '/experience-list-items', to: "experience_list_items#index"

        get '/experiences/:short_url', to: 'experiences#short_url', constraints: { short_url: /\w{6}/ }
        get '/experiences', to: 'experiences#index'
        post '/experiences', to: 'experiences#create'
        get '/experiences/:id', to: 'experiences#show', version_id: 'live'
        patch '/experiences/:id/publish', to: 'experiences#publish', version_id: 'current'
        patch '/experiences/:id/:version_id/publish', to: 'experiences#publish'
        patch '/experiences/:id/revert', to: 'experiences#revert'
        patch '/experiences/:id/archive', to: 'experiences#archive'
        patch '/experiences/:id/unarchive', to: 'experiences#unarchive'
        delete '/experiences/:id/:version_id', to: 'experiences#delete_version'
        resources '/experiences/:id/', controller: 'experiences', as: 'versioned_experience', param: :version_id, only: [:show, :update, :destroy]
        
        get '/app-profiles', to: 'app_profiles#show'
    end
end
