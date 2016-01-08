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

ActiveRecord::Schema.define(version: 20160107180658) do

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
    t.text     "token",                                                null: false
    t.text     "share_key",                                            null: false
    t.integer  "users_count",                              default: 0
    t.integer  "locations_count",                          default: 0
    t.integer  "ibeacon_configurations_count",             default: 0
    t.integer  "eddystone_namespace_configurations_count", default: 0
    t.integer  "eddystone_url_configurations_count",       default: 0
    t.integer  "beacon_configurations_count",              default: 0
    t.integer  "account_invites_count",                    default: 0
    t.datetime "created_at",                                           null: false
    t.datetime "updated_at",                                           null: false
  end

  add_index "accounts", ["token"], name: "index_accounts_on_token", unique: true, using: :btree

  create_table "beacon_configurations", force: :cascade do |t|
    t.integer "account_id",                     null: false
    t.integer "location_id"
    t.string  "configurable_type"
    t.integer "configurable_id"
    t.string  "title"
    t.text    "tags",              default: [],              array: true
    t.integer "devices_count",     default: 0
  end

  add_index "beacon_configurations", ["account_id", "configurable_type"], name: "beacon_configurations_account_configurable_type", using: :btree
  add_index "beacon_configurations", ["configurable_id", "configurable_type"], name: "beacon_configurations_account_configurable_index", using: :btree

  create_table "eddystone_namespace_configurations", force: :cascade do |t|
    t.integer "account_id",   null: false
    t.string  "namespace"
    t.integer "namespace_id"
  end

  add_index "eddystone_namespace_configurations", ["account_id"], name: "index_eddystone_namespace_configurations_on_account_id", using: :btree
  add_index "eddystone_namespace_configurations", ["namespace", "namespace_id"], name: "eddystone_namespace_uuid", unique: true, using: :btree
  add_index "eddystone_namespace_configurations", ["namespace"], name: "index_eddystone_namespace_configurations_on_namespace", using: :btree

  create_table "eddystone_url_configurations", force: :cascade do |t|
    t.integer "account_id", null: false
    t.text    "url"
  end

  add_index "eddystone_url_configurations", ["account_id"], name: "index_eddystone_url_configurations_on_account_id", using: :btree
  add_index "eddystone_url_configurations", ["url"], name: "index_eddystone_url_configurations_on_url", using: :btree

  create_table "ibeacon_configurations", force: :cascade do |t|
    t.integer "account_id", null: false
    t.string  "uuid"
    t.integer "major"
    t.integer "minor"
  end

  add_index "ibeacon_configurations", ["account_id"], name: "index_ibeacon_configurations_on_account_id", using: :btree
  add_index "ibeacon_configurations", ["uuid", "major", "minor"], name: "index_ibeacon_configurations_on_uuid_and_major_and_minor", unique: true, using: :btree

  create_table "locations", force: :cascade do |t|
    t.integer  "account_id",                               null: false
    t.text     "name"
    t.text     "address"
    t.text     "city"
    t.text     "province_state"
    t.text     "postal_zip"
    t.text     "country"
    t.decimal  "latitude"
    t.decimal  "longitude"
    t.integer  "radius"
    t.text     "google_place_id"
    t.text     "tags",                        default: [],              array: true
    t.integer  "beacon_configurations_count", default: 0
    t.datetime "created_at",                               null: false
    t.datetime "updated_at",                               null: false
  end

  add_index "locations", ["account_id"], name: "index_locations_on_account_id", using: :btree

  create_table "password_resets", id: false, force: :cascade do |t|
    t.integer  "user_id",    null: false
    t.text     "email",      null: false
    t.text     "token",      null: false
    t.datetime "expires_at", null: false
  end

  add_index "password_resets", ["email"], name: "index_password_resets_on_email", unique: true, using: :btree
  add_index "password_resets", ["token"], name: "index_password_resets_on_token", unique: true, using: :btree

  create_table "sessions", force: :cascade do |t|
    t.integer "account_id"
    t.integer "user_id"
    t.string  "token"
  end

  add_index "sessions", ["account_id"], name: "index_sessions_on_account_id", using: :btree
  add_index "sessions", ["token"], name: "index_sessions_on_token", using: :btree

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
