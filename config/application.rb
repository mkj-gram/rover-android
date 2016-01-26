require File.expand_path('../boot', __FILE__)

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

require 'elasticsearch/rails/instrumentation'
module RailsApi
    class Application < Rails::Application

        config.active_record.schema_format = :sql

        # Setup configuration per enviroment
        config.rabbitmq = Rails.application.config_for(:rabbitmq)
        config.mailgun = Rails.application.config_for(:mailgun)
        config.password_reset = Rails.application.config_for(:password_reset)
        config.elasticsearch = Rails.application.config_for(:elasticsearch)
        # Autoload our libraries
        config.autoload_paths << Rails.root.join('app', 'models', 'beacon_configurations')
        config.autoload_paths << Rails.root.join('app', 'models', 'third_party_integrations')
        config.autoload_paths << Rails.root.join('app', 'models', 'beacon_devices')
        config.autoload_paths << Rails.root.join('app', 'models', 'beacon_devices', 'concerns')
        config.autoload_paths << Rails.root.join('app', 'models', 'beacon_devices', 'estimote')
        config.autoload_paths << Rails.root.join('app', 'models', 'beacon_devices', 'kontakt')
        # Generic Classes
        config.autoload_paths << Rails.root.join('app', 'classes')

        # config.autoload_paths << Rails.root.join('app', 'models', 'beacon_configurations', 'ibeacon_configuration')
        config.autoload_paths << Rails.root.join('lib', 'mail_client')
        config.autoload_paths << Rails.root.join('lib', 'model_broadcaster')
        config.autoload_paths << Rails.root.join('lib', 'rabbit_mq_publisher')
        config.autoload_paths << Rails.root.join('lib', 'model_error')
        config.autoload_paths << Rails.root.join('lib', 'estimote_api')
        config.autoload_paths << Rails.root.join('lib', 'kontakt_api')
        config.autoload_paths << Rails.root.join('app', 'workers')
        config.eager_load_paths << Rails.root.join('app', 'error_serializers', '**')



        # Do not swallow errors in after_commit/after_rollback callbacks.
        config.active_record.raise_in_transactional_callbacks = true


        config.middleware.insert_before 0, "Rack::Cors" do
            allow do
                origins '*'
                resource '*', :headers => :any, :methods => [:get, :post, :delete, :put, :patch, :options]
            end
        end

    end
end
