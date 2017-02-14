namespace :elasticsearch do

    def create_index!(name, settings, mappings)
        begin
            Elasticsearch::Model.client.indices.create index: name, body: { settings: settings, mappings: mappings }
        rescue Elasticsearch::Transport::Transport::Errors::BadRequest => e
            puts e
        end
    end

    desc "Create indexes"
    task :create_indexes => :environment do

        puts "Creating BeaconConfiguration Index"
        beacon_configuration_models = [IBeaconConfiguration, EddystoneNamespaceConfiguration, UrlConfiguration]
        settings = beacon_configuration_models.map(&:settings).reduce({}, &:merge)
        mappings = beacon_configuration_models.map(&:mappings).reduce({}, &:merge)
        create_index!(BeaconConfiguration.index_name, settings, mappings)

        puts "Creating Experience Index"
        settings = Experiences::Experience.settings
        mappings = Experiences::Experience.mappings
        create_index!(Experiences::Experience.index_name, settings, mappings)


        puts "Creating Messages Index"
        beacon_configuration_models = [ProximityMessageTemplate, ScheduledMessageTemplate]
        settings = beacon_configuration_models.map(&:settings).reduce({}, &:merge)
        mappings = beacon_configuration_models.map(&:mappings).reduce({}, &:merge)
        create_index!(MessageTemplate.index_name, settings, mappings)

        puts "Creating Places Index"
        settings = Place.settings
        mappings = Place.mappings
        create_index!(Place.index_name, settings, mappings)

        puts "Create Customer Index"
        # special mapping
        begin
            Customer.create_index!
        rescue Elasticsearch::Transport::Transport::Errors::BadRequest => e
            puts e
        end

        puts "Creating GimbalPlaces"
        settings = GimbalPlace.settings
        mappings = GimbalPlace.mappings
        create_index!(GimbalPlace.index_name, settings, mappings)

    end

    namespace :import do

        desc "Import Customers"
        task :customers => :environment do
            Customer.import
        end

        desc "Import Beacon Configurations"
        task :beacon_configurations => :environment do
            IBeaconConfiguration.import
            EddystoneNamespaceConfiguration.import
            UrlConfiguration.import
        end

        desc "Import Message Templates"
        task :message_templates => :environment do
            ProximityMessageTemplate.find_in_batches(batch_size: 1000) do |batch|
                body = []
                batch.each do |proximity_message|
                    body.push({ index: { _index: ProximityMessageTemplate.index_name, _type: ProximityMessageTemplate.document_type, _id: proximity_message.id }})
                    body.push(proximity_message.as_indexed_json)
                end
                Elasticsearch::Model.client.bulk(body: body)
            end

            ScheduledMessageTemplate.find_in_batches(batch_size: 1000) do |batch|
                body = []
                batch.each do |scheduled_message|
                    body.push({ index: { _index: ScheduledMessageTemplate.index_name, _type: ScheduledMessageTemplate.document_type, _id: scheduled_message.id }})
                    body.push(scheduled_message.as_indexed_json)
                end
                Elasticsearch::Model.client.bulk(body: body)
            end
        end

        desc "Import Places"
        task :places => :environment do
            Place.import
        end

        desc "Import Gimbal Places"
        task :gimbal_places => :environment do
            GimbalPlace.import
        end



        desc "Import All"
        task :all => [:environment, :customers, :beacon_configurations, :message_templates, :places, :gimbal_places] do
        end

    end


    namespace :customers do

        desc "Create aliases"
        task :create_aliases => :environment do
            Account.find_each(batch_size: 1000) do |account|
                Customer.create_alias!(account)
            end
        end

    end


end
