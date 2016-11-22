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
        config.mongo = Rails.application.config_for(:mongo)
        config.google_oauth = Rails.application.config_for(:google_oauth)
        config.rover = Rails.application.config_for(:rover)
        config.sentry = Rails.application.config_for(:sentry)
        
        # Autoload our libraries
        config.autoload_paths << Rails.root.join('lib')
        config.autoload_paths << Rails.root.join('app', 'models', 'message_templates')
        config.autoload_paths << Rails.root.join('app', 'models', 'configuration_visits')
        config.autoload_paths << Rails.root.join('app', 'models', 'platforms')
        # config.autoload_paths << Rails.root.join('app', 'models', 'events')
        # config.autoload_paths << Rails.root.join('app', 'models', 'events', 'location_events')
        # config.autoload_paths << Rails.root.join('app', 'models', 'events', 'beacon_region_events')
        # config.autoload_paths << Rails.root.join('app', 'models', 'events', 'geofence_region_events')
        # config.autoload_paths << Rails.root.join('app', 'models', 'events', 'app_events')
        config.autoload_paths << Rails.root.join('app', 'models', 'third_party_integration_sync_jobs')
        config.autoload_paths << Rails.root.join('app', 'models', 'beacon_configurations')
        config.autoload_paths << Rails.root.join('app', 'models', 'third_party_integrations')
        config.autoload_paths << Rails.root.join('app', 'models', 'beacon_devices')
        config.autoload_paths << Rails.root.join('app', 'models', 'beacon_devices', 'concerns')
        config.autoload_paths << Rails.root.join('app', 'models', 'beacon_devices', 'estimote')
        config.autoload_paths << Rails.root.join('app', 'models', 'beacon_devices', 'kontakt')
        config.autoload_paths << Rails.root.join('app', 'models', 'active_tags')
        config.autoload_paths << Rails.root.join('app', 'models', 'active_configuration_uuids')
        # Generic Classes
        config.autoload_paths << Rails.root.join('app', 'classes')

        # config.autoload_paths << Rails.root.join('app', 'models', 'beacon_configurations', 'ibeacon_configuration')
        config.autoload_paths << Rails.root.join('lib', 'push_connection_cache')
        config.autoload_paths << Rails.root.join('lib', 'mail_client')
        config.autoload_paths << Rails.root.join('lib', 'customer_filter')
        config.autoload_paths << Rails.root.join('lib', 'message_limit')
        config.autoload_paths << Rails.root.join('lib', 'model_broadcaster')
        config.autoload_paths << Rails.root.join('lib', 'rabbit_mq_publisher')
        config.autoload_paths << Rails.root.join('lib', 'model_error')
        config.autoload_paths << Rails.root.join('lib', 'estimote_api')
        config.autoload_paths << Rails.root.join('lib', 'kontakt_api')
        config.autoload_paths << Rails.root.join('lib', 'events_logger')
        config.autoload_paths << Rails.root.join('lib', 'gimbal_api')
        config.autoload_paths << Rails.root.join('lib', 'time_zone_offset')
        config.autoload_paths << Rails.root.join('app', 'workers')


        config.eager_load_paths << Rails.root.join('lib', 'metrics_client')
        config.eager_load_paths << Rails.root.join('app', 'error_serializers', '**')
        config.eager_load_paths << Rails.root.join('app', 'models', 'events')

        # Core Extensions
        config.autoload_paths << Rails.root.join('lib', "core_ext")

        # Do not swallow errors in after_commit/after_rollback callbacks.
        config.active_record.raise_in_transactional_callbacks = true

        config.time_zone = 'UTC'
        config.active_record.default_timezone = :local

        config.middleware.insert_before 0, "Rack::Cors" do
            allow do
                origins '*'
                resource '*', :headers => :any, :methods => [:get, :post, :delete, :put, :patch, :options]
            end
        end

    end
end

require 'core_ext/hash'
require 'core_ext/string'
require 'color_converter/color_converter'
require 'iso_639'
require 'iso_3166'

# first require the event then require everything else
# require Rails.root.join("app", "models", "events", "events.rb").to_s
