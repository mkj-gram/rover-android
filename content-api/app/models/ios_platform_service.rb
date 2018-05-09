require 'rover-auth'
require 'notification/v1/notification_pb'
require 'notification/v1/notification_services_pb'

class IosPlatformService
  def self.get(account_id:, id:)
    auth_context = Rover::Auth::V1::AuthContext.new(
      account_id: account_id,
      permission_scopes: ["api:content-api"],
    )

    resp = NOTIFICATION_CLIENT.get_ios_platform(Rover::Notification::V1::GetIosPlatformRequest.new(
      auth_context: auth_context,
      platform_id: id,
    ))

    resp.ios_platform
  end

  def self.create(account_id:, attrs: {})
    p = IosPlatform.new({account_id: account_id}.update(attrs))

    auth_context = Rover::Auth::V1::AuthContext.new(
      account_id: p.account_id,
      permission_scopes: ["api:content-api"],
    )

    resp = NOTIFICATION_CLIENT.create_ios_platform(Rover::Notification::V1::CreateIosPlatformRequest.new(
      auth_context: auth_context,

      title: p.title.to_s,
      certificate_data: attrs[:certificate].to_s,
      certificate_passphrase: attrs[:passphrase].to_s,
      certificate_filename: attrs[:filename].to_s,
    ))

    # explicitly sets the id
    p.id = resp.ios_platform.id

    [p, p.save]
  end

  def self.update_certificate(platform:, attrs: )
    if (file = attrs[:certificate]).respond_to?(:original_filename)
      attrs[:certificate] = file.read
      attrs[:certificate_filename] = file.original_filename
    end

    auth_context = Rover::Auth::V1::AuthContext.new(
      account_id: platform.account_id,
      permission_scopes: ["api:content-api"],
    )

    resp = NOTIFICATION_CLIENT.update_ios_platform_push_certificate(Rover::Notification::V1::UpdateIosPlatformPushCertificateRequest.new(
      auth_context: auth_context,

      ios_platform_id: platform.id,

      certificate_data: attrs[:certificate].to_s,
      certificate_passphrase: attrs[:passphrase].to_s,
      certificate_filename: attrs[:certificate_filename].to_s,
    ))

    platform.update_attributes(attrs)
  end


  def self.clear_credentials(platform:)
    self.update_certificate(platform: platform, attrs: {
      credentials: {},
      apns_certificate: "",
      apns_passphrase: "",
      certificate_filename: "",
      bundle_id: "",
    })
  end
end
