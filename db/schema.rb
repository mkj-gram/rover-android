# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160202201635) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "account_invites", force: :cascade do |t|
    t.integer  "account_id",    null: false
    t.integer  "issuer_id",     null: false
    t.text     "invited_email", null: false
    t.text     "token",         null: false
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  add_index "account_invites", ["invited_email"], name: "index_account_invites_on_invited_email", unique: true, using: :btree
  add_index "account_invites", ["token"], name: "index_account_invites_on_token", unique: true, using: :btree

  create_table "accounts", force: :cascade do |t|
    t.text     "title"
    t.integer  "primary_user_id"
    t.text     "token",                                              null: false
    t.text     "share_key",                                          null: false
    t.integer  "users_count",                            default: 0
    t.integer  "locations_count",                        default: 0
    t.integer  "searchable_beacon_configurations_count", default: 0
    t.integer  "searchable_locations_count",             default: 0
    t.integer  "account_invites_count",                  default: 0
    t.datetime "created_at",                                         null: false
    t.datetime "updated_at",                                         null: false
  end

  add_index "accounts", ["share_key"], name: "index_accounts_on_share_key", unique: true, using: :btree
  add_index "accounts", ["token"], name: "index_accounts_on_token", unique: true, using: :btree

  create_table "active_tags_indices", force: :cascade do |t|
    t.integer "account_id",              null: false
    t.string  "type",                    null: false
    t.string  "tags",       default: [],              array: true
  end

  add_index "active_tags_indices", ["account_id", "type"], name: "index_active_tags_indices_on_account_id_and_type", unique: true, using: :btree

  create_table "beacon_configurations", force: :cascade do |t|
    t.integer  "account_id",                                null: false
    t.integer  "location_id"
    t.string   "type",                                      null: false
    t.text     "title"
    t.string   "tags",                      default: [],                 array: true
    t.boolean  "enabled",                   default: true
    t.boolean  "shared",                    default: false
    t.string   "uuid"
    t.integer  "major"
    t.integer  "minor"
    t.string   "namespace"
    t.string   "instance_id"
    t.text     "url"
    t.datetime "beacon_devices_updated_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "beacon_configurations", ["account_id", "namespace", "instance_id"], name: "account_eddystone_namespace_index", unique: true, using: :btree
  add_index "beacon_configurations", ["account_id", "type", "created_at"], name: "beacon_configurations_type_created_at_index", using: :btree
  add_index "beacon_configurations", ["account_id", "type"], name: "index_beacon_configurations_on_account_id_and_type", using: :btree
  add_index "beacon_configurations", ["account_id", "uuid", "major", "minor"], name: "account_ibeacon_index", unique: true, using: :btree
  add_index "beacon_configurations", ["account_id"], name: "index_beacon_configurations_on_account_id", using: :btree
  add_index "beacon_configurations", ["location_id"], name: "index_beacon_configurations_on_location_id", using: :btree
  add_index "beacon_configurations", ["url"], name: "index_beacon_configurations_on_url", unique: true, using: :btree
  add_index "beacon_configurations", ["uuid"], name: "index_beacon_configurations_on_uuid", using: :btree

  create_table "beacon_devices", force: :cascade do |t|
    t.integer "account_id",                              null: false
    t.integer "third_party_integration_id",              null: false
    t.string  "manufacturer_id",                         null: false
    t.string  "type",                                    null: false
    t.string  "uuid"
    t.integer "major"
    t.integer "minor"
    t.string  "namespace"
    t.string  "instance_id"
    t.text    "url"
    t.jsonb   "device_data",                default: {}
  end

  add_index "beacon_devices", ["account_id", "manufacturer_id"], name: "index_beacon_devices_on_account_id_and_manufacturer_id", unique: true, using: :btree
  add_index "beacon_devices", ["account_id", "namespace", "instance_id"], name: "index_account_eddystone_devices", using: :btree
  add_index "beacon_devices", ["account_id", "url"], name: "index_beacon_devices_on_account_id_and_url", using: :btree
  add_index "beacon_devices", ["account_id", "uuid", "major", "minor"], name: "index_account_ibeacon_devices", using: :btree
  add_index "beacon_devices", ["third_party_integration_id"], name: "index_beacon_devices_on_third_party_integration_id", using: :btree

  create_table "locations", force: :cascade do |t|
    t.integer  "account_id",                                  null: false
    t.string   "title"
    t.text     "address"
    t.text     "city"
    t.text     "province"
    t.string   "country"
    t.string   "postal_code"
    t.float    "latitude"
    t.float    "longitude"
    t.integer  "radius",                      default: 50
    t.text     "tags",                        default: [],                 array: true
    t.text     "google_place_id"
    t.boolean  "enabled",                     default: true
    t.boolean  "shared",                      default: false
    t.integer  "beacon_configurations_count", default: 0
    t.datetime "created_at",                                  null: false
    t.datetime "updated_at",                                  null: false
  end

  add_index "locations", ["account_id"], name: "index_locations_on_account_id", using: :btree
  add_index "locations", ["tags"], name: "index_locations_on_tags", using: :gin

  create_table "password_resets", force: :cascade do |t|
    t.integer  "user_id",    null: false
    t.text     "email",      null: false
    t.text     "token",      null: false
    t.datetime "expires_at", null: false
  end

  add_index "password_resets", ["email"], name: "index_password_resets_on_email", using: :btree
  add_index "password_resets", ["token"], name: "index_password_resets_on_token", unique: true, using: :btree
  add_index "password_resets", ["user_id"], name: "index_password_resets_on_user_id", using: :btree

  create_table "sessions", force: :cascade do |t|
    t.integer "account_id"
    t.integer "user_id"
    t.string  "token"
  end

  add_index "sessions", ["account_id"], name: "index_sessions_on_account_id", using: :btree
  add_index "sessions", ["token"], name: "index_sessions_on_token", using: :btree

  create_table "shared_beacon_configurations", force: :cascade do |t|
    t.integer "owner_account_id"
    t.integer "shared_account_id"
    t.integer "beacon_configuration_id"
  end

  add_index "shared_beacon_configurations", ["owner_account_id"], name: "index_shared_beacon_configurations_on_owner_account_id", using: :btree
  add_index "shared_beacon_configurations", ["shared_account_id"], name: "index_shared_beacon_configurations_on_shared_account_id", using: :btree

  create_table "third_party_integration_sync_jobs", force: :cascade do |t|
    t.integer  "third_party_integration_id",                      null: false
    t.integer  "status",                              default: 0
    t.datetime "started_at"
    t.datetime "finished_at"
    t.text     "error_message"
    t.integer  "added_devices_count",                 default: 0
    t.integer  "modified_devices_count",              default: 0
    t.integer  "removed_devices_count",               default: 0
    t.datetime "created_at",                                      null: false
    t.datetime "updated_at",                                      null: false
    t.integer  "devices_changed_configuration_count", default: 0
  end

  add_index "third_party_integration_sync_jobs", ["created_at"], name: "integration_sync_job_integration_created_at_index", order: {"created_at"=>:desc}, using: :btree
  add_index "third_party_integration_sync_jobs", ["finished_at"], name: "integration_sync_job_integration_finished_at_index", order: {"finished_at"=>:desc}, using: :btree
  add_index "third_party_integration_sync_jobs", ["started_at"], name: "integration_sync_job_integration_started_at_index", order: {"started_at"=>:desc}, using: :btree
  add_index "third_party_integration_sync_jobs", ["third_party_integration_id"], name: "integration_sync_job_integration_id_index", using: :btree

  create_table "third_party_integrations", force: :cascade do |t|
    t.integer  "account_id",                                              null: false
    t.string   "type",                                                    null: false
    t.boolean  "syncing",                                 default: false
    t.boolean  "enabled",                                 default: true
    t.string   "encrypted_credentials"
    t.string   "encrypted_credentials_salt"
    t.string   "encrypted_credentials_iv"
    t.integer  "average_sync_time_in_ms",                 default: 0
    t.datetime "last_synced_at"
    t.datetime "created_at",                                              null: false
    t.datetime "updated_at",                                              null: false
    t.integer  "third_party_integration_sync_jobs_count", default: 0
  end

  add_index "third_party_integrations", ["account_id", "enabled"], name: "index_third_party_integrations_on_account_id_and_enabled", using: :btree
  add_index "third_party_integrations", ["account_id", "type"], name: "index_third_party_integrations_on_account_id_and_type", using: :btree
  add_index "third_party_integrations", ["account_id"], name: "index_third_party_integrations_on_account_id", using: :btree

  create_table "user_acls", id: false, force: :cascade do |t|
    t.integer "user_id",                           null: false
    t.boolean "admin",             default: false
    t.boolean "users_index",       default: true
    t.boolean "users_show",        default: true
    t.boolean "users_create",      default: true
    t.boolean "users_update",      default: false
    t.boolean "users_destroy",     default: false
    t.boolean "locations_index",   default: true
    t.boolean "locations_show",    default: true
    t.boolean "locations_create",  default: true
    t.boolean "locations_update",  default: true
    t.boolean "locations_destroy", default: false
  end

  add_index "user_acls", ["user_id"], name: "index_user_acls_on_user_id", unique: true, using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "name"
    t.string   "email",                           null: false
    t.string   "password_digest",                 null: false
    t.integer  "account_id",                      null: false
    t.boolean  "account_owner",   default: false
    t.datetime "acl_updated_at"
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
  end

  add_index "users", ["account_id"], name: "index_users_on_account_id", using: :btree
  add_index "users", ["email"], name: "index_users_on_email", using: :btree

end
