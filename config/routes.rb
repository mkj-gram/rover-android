Rails.application.routes.draw do
    # resources :account_invites, except: [:new, :edit]
    # resources :shared_beacons, except: [:new, :edit]
    # resources :shared_locations, except: [:new, :edit]

    # resources :users, except: [:new, :edit]
    # resources :accounts, except: [:new, :edit]

    # scope module: :v1, constraints: ApiConstraint.new(version: 1) do
    #     resources :apps, except: [:new, :edit]
    # end
    api_version(:module => "V1", :path => {:value => "v1"}, :parameter => {:name => "version", :value => "1"}, default: true, :defaults => { :format => 'json' }) do
        # resources :accounts do
        #     scope module: "account_context" do
        #         resources :users
        #         # resources :locations, :controller => ""
        #     end
        # end

        get 'account', to: 'account#show'
        patch 'account', to: 'account#update'

        resources :users, except:[:create] do

            # resources :password_reset, only: [:create]
        end

        post 'registrations', to: "registrations#create"

        resources "password-resets", only: [:index, :create, :update], controller: "password_resets", :as => 'password_reset'

        resources :account_invites, only: [:index, :create, :destroy]
        get '/account_invites/:token', to: "account_invites#show"

        resources :locations do
            # collection do
            # scope module: "locations" do
            #     collection do
            #         delete  '', to: "bulk#destroy",   as: "bulk_delete"
            #         patch   '', to: "bulk#update",    as: "bulk_update"
            #         post    '', to: "bulk#create",    as: "bulk_create"
            #     end
            # end

            # end
            # namespace :relationships, module: "locations" do
            #     resources :beacons
            # end
        end

        resources :sessions, only: [:create, :show, :destroy]

        resources "configurations", controller: "beacon_configurations", as: "beacon_configuration"
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
