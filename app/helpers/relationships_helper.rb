# module RelationshipsHelper

#     class Relationship

#         attr_reader :valid, :ids

#         def initialize(key, data)
#             @valid = true

#             begin
#                 @model = key.singularize.classify.constantize
#             rescue NameError => e
#                 @valid = false
#             end

#             relationships = data[:data]

#             if relationships.is_a?(Hash)
#                 relationships = [relationships]
#             end

#             relationships.delete_if do |relation|
#                 relation[:type] != key
#             end

#             @ids = relationships.map{|relation| relation[:id]}

#         end
#     end

#     # {
#     # "data": {
#     #   "type": "articles",
#     #   "id": "1",
#     #   "relationships": {
#     #     "author": {
#     #       "data": { "type": "people", "id": "1" }
#     #     }
#     #   }
#     # }
#     # each data has a sub
#     # lets just play dumb for now and pass relationships to the model it should be responsible for updating it
#     }
#     def relationships
#         # if relations is present we want strong params?
#         # we could have an outer level id
#         if params.has_key?(:relationships)
#             # we need to loop through the
#             params[:relationships].each do |type, data|
#                 params.require(:relationships).require
#             end
#         end

#         data = params.has_key?(:relationships) ? params[:relationships] : []
#         relations = data.map{|k,v| Relationship.new(k,v)}
#         relations.delete_if{|relation| !relation.valid }
#         return relations
#     end
# end
