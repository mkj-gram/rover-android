# # This file should contain all the record creation needed to seed the database with its default values.
# # The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
# #
# # Examples:
# #
# #   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
# #   Mayor.create(name: 'Emanuel', city: cities.first)

# require 'faker'



# num_records = 1

# def share_location(location, owner, shared_account)
#     location.shared_locations.create(owner_account_id: owner.id, shared_account_id: shared_account.id)
# end

# accounts = []
# users = []

# # num_records.times.each do |i|
# #     password = Faker::Internet.password(10, 20)
# #     user = User.create!(name: Faker::Name.name, email: Faker::Internet.email, password: password, password_confirmation: password)
# #     users << user
# #     accounts << user.account
# # end
# user = User.create(name: "Chris Recalis", email: "crecalis@gmail.com", password: "1", password_confirmation: "1")
# accounts << user.account
# users << user

# user = User.create(name: "Nope Mala", email: "nope@gmail.com", password: "1", password_confirmation: "1")
# accounts << user.account
# users << user

# p "Api-key: #{user.account.token}"
# p "User-key: #{user.jwt_token}"

# accounts.each do |account|
#     10.times.each do |i|
#         p i
#         password = Faker::Internet.password(10, 20)
#         account.users.create!(name: Faker::Name.name, email: Faker::Internet.email, password: password, password_confirmation: password)
#     end
# end

# accounts.each do |account|
#     num_records.times.each do |i|
#         p i
#         Location.create!(
#             account_id: account.id,
#             name: Faker::Address.street_name,
#             address: Faker::Address.street_address,
#             city: Faker::Address.city,
#             province_state: Faker::Address.state,
#             postal_zip: Faker::Address.zip_code,
#             country: Faker::Address.country,
#             latitude: Faker::Address.latitude,
#             longitude: Faker::Address.longitude,
#             radius: Random.rand(500) + 50,
#             tags: Faker::Hipster.words(Random.rand(5), true, true)
#         )
#     end
# end
