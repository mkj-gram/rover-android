//
//  Notification.swift
//  RoverNotifications
//
//  Created by Sean Rucker on 2018-05-02.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

public struct Notification: Codable, Equatable, Hashable {
    public struct Attachment: Codable, Equatable {
        public enum Format: String, Codable {
            case audio = "AUDIO"
            case image = "IMAGE"
            case video = "VIDEO"
        }
        
        private enum CodingKeys: String, CodingKey {
            case format = "type"
            case url
        }
        
        public var format: Format
        public var url: URL
    }
    
    public enum Action: Equatable {
        case openURL(url: URL)
        case presentExperience(campaignID: ID)
        case presentWebsite(url: URL)
    }
    
    public var id: ID
    public var campaignID: ID
    public var title: String?
    public var body: String
    public var attachment: Attachment?
    public var action: Action?
    public var deliveredAt: Date
    public var expiresAt: Date?
    public var isRead: Bool
    public var isNotificationCenterEnabled: Bool
    public var isDeleted: Bool
    
    public var hashValue: Int {
        return id.hashValue
    }
    
    public init(id: ID, campaignID: ID, title: String?, body: String, attachment: Attachment?, action: Action?, deliveredAt: Date, expiresAt: Date?, isRead: Bool, isNotificationCenterEnabled: Bool, isDeleted: Bool) {
        self.id = id
        self.campaignID = campaignID
        self.title = title
        self.body = body
        self.attachment = attachment
        self.action = action
        self.deliveredAt = deliveredAt
        self.expiresAt = expiresAt
        self.isRead = isRead
        self.isNotificationCenterEnabled = isNotificationCenterEnabled
        self.isDeleted = isDeleted
    }
}

extension Notification {
    func openedEvent() -> EventInfo {
        let attributes: Attributes = ["notificationID": id.rawValue]
        return EventInfo(name: "Notification Opened", namespace: "rover", attributes: attributes)
    }
}

// MARK: Notification.Action

extension Notification.Action: Action {
    public func operation(_ resolver: Resolver) -> RoverFoundation.Operation? {
        switch self {
        case .openURL(let url):
            return resolver.resolve(Operation.self, name: "openURL", arguments: url)
        case .presentExperience(let campaignID):
            return resolver.resolve(Operation.self, name: "presentExperience", arguments: campaignID)
        case .presentWebsite(let url):
            return resolver.resolve(Operation.self, name: "presentWebsite", arguments: url)
        }
    }
}

extension Notification.Action: Codable {
    enum CodingKeys: String, CodingKey {
        case typeName = "__typename"
        case url
        case campaignID
    }
    
    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let typeName = try container.decode(String.self, forKey: .typeName)
        
        switch typeName {
        case "OpenURLAction":
            let url = try container.decode(URL.self, forKey: .url)
            self = .openURL(url: url)
        case "PresentExperienceAction":
            let campaignID = try container.decode(ID.self, forKey: .campaignID)
            self = .presentExperience(campaignID: campaignID)
        case "PresentWebsiteAction":
            let url = try container.decode(URL.self, forKey: .url)
            self = .presentWebsite(url: url)
        default:
            throw DecodingError.dataCorruptedError(forKey: CodingKeys.typeName, in: container, debugDescription: "Expected one of AudioAttachment, ImageAttachment or VideoAttachment – found \(typeName)")
        }
    }
    
    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        switch self {
        case .openURL(let url):
            try container.encode("OpenURLAction", forKey: .typeName)
            try container.encode(url, forKey: .url)
        case .presentExperience(let campaignID):
            try container.encode("PresentExperienceAction", forKey: .typeName)
            try container.encode(campaignID, forKey: .campaignID)
        case .presentWebsite(let url):
            try container.encode("PresentWebsiteAction", forKey: .typeName)
            try container.encode(url, forKey: .url)
        }
    }
}
