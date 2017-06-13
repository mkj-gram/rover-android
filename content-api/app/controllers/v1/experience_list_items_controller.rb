class V1::ExperienceListItemsController < V1::ApplicationController

    before_action :authenticate
   

    def index
        # grab all experiences
        
        must_filter = [{ term: { account_id: current_account.id }}]
        must_filter += query_collection_type if query_collection_type

        if query_keyword
            query = {
                fields: [],
                query: {
                    filtered: {
                        query: {
                            match_phrase: {
                                title: query_keyword
                            }
                        },
                        filter: {
                            bool: {
                                must: must_filter
                            }
                        }
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
        else
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
        end

        search_query = Elasticsearch::Model.search(query, [Experiences::Experience])
        results = search_query.per_page(page_size).page(current_page).results

        experience_ids = results.map { |doc| doc._id }

        experiences = Experiences::Experience.find_all(experience_ids)

        data = []

        if experiences.present?
            data = experiences.map{ |experience| V1::ExperienceListItemSerializer.serialize(experience, get_simulator_url(experience)) } 
        end

        render json: Oj.dump(
            {
                data: data,
                meta: {
                    totalDrafts: current_account.experiences_draft_count,
                    totalPublished: current_account.experiences_published_count,
                    totalArchived: current_account.experiences_archived_count,
                    totalRecords: results.total,
                    totalPages: results.total_pages
                }
        })
    end


    private

    def query_keyword
        params.dig(:filter, :query)
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


     def get_simulator_url(experience)
        cname = get_cname(experience)

        if !cname.nil?
            # don't use the subdomain when we are using a cname
            subdomain = nil
        else
            subdomain = get_subdomain(experience)
        end


        host = cname.nil? ? Rails.configuration.simulator["host"] : cname
        
        short_url = experience.short_url
        
        if subdomain.nil? || subdomain.empty?
            return "https://#{host}/#{short_url}"
        else
            return "https://#{subdomain}.#{host}/#{short_url}"
        end
    end

    def get_cname(experience)
        if !current_account.nil? && current_account.id == experience.account_id 
            return current_account.cname
        else
            account = Account.find(experience.account_id)
            return account ? account.cname : nil
        end
    end

    def get_subdomain(experience)
        if !current_account.nil? && current_account.id == experience.account_id
            return current_account.subdomain
        else
            account = Account.find(experience.account_id)
            return account ? account.subdomain : nil
        end
    end

end
