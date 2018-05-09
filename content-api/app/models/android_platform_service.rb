require 'rover-auth'
require 'notification/v1/notification_pb'
require 'notification/v1/notification_services_pb'

class AndroidPlatformService
  def self.get(account_id:, id:)
    auth_context = Rover::Auth::V1::AuthContext.new(
      account_id: account_id,
      permission_scopes: ["api:content-api"],
    )

    resp = NOTIFICATION_CLIENT.get_android_platform(Rover::Notification::V1::GetAndroidPlatformRequest.new(
      auth_context: auth_context,
      platform_id: id,
    ))

    resp.android_platform
  end

  def self.create(account_id:, attrs: {})
    p = AndroidPlatform.new({account_id: account_id}.update(attrs))

    auth_context = Rover::Auth::V1::AuthContext.new(
      account_id: p.account_id,
      permission_scopes: ["api:content-api"],
    )

    resp = NOTIFICATION_CLIENT.create_android_platform(Rover::Notification::V1::CreateAndroidPlatformRequest.new(
      auth_context: auth_context,

      title: p.title.to_s,
      push_credentials_server_key: p.api_key.to_s,
      push_credentials_sender_id: p.sender_id.to_s,
    ))

    # explicitly sets the id
    p.id = resp.android_platform.id

    [p, p.save]
  end

  def self.update(platform:, attrs: {})
    auth_context = Rover::Auth::V1::AuthContext.new(
      account_id: platform.account_id,
      permission_scopes: ["api:content-api"],
    )

    resp = NOTIFICATION_CLIENT.update_android_platform_push_credentials(Rover::Notification::V1::UpdateAndroidPlatformPushCredentialsRequest.new(
      auth_context: auth_context,

      android_platform_id: platform.id,

      push_credentials_server_key: attrs[:api_key],
      push_credentials_sender_id: attrs[:sender_id]
    ))

    platform.update_attributes(attrs)
  end

  def self.clear_credentials(platform:)
    self.update(platform: platform, attrs: {
      api_key: "",
      sender_id: "",
    })
  end
end
