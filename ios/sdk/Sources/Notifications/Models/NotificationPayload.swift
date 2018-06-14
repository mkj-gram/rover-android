//
//  NotificationPayload.swift
//  RoverNotifications
//
//  Created by Sean Rucker on 2018-05-14.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

import Foundation

struct NotificationPayload: Decodable {
    enum Action {
        case addNotification(notification: Notification)
    }
    
    var action: Action
}

// MARK: NotificationPayload.Action

extension NotificationPayload.Action: Action {
    public func operation(_ resolver: Resolver) -> Operation? {
        switch self {
        case .addNotification(let notification):
            return resolver.resolve(Operation.self, name: "addNotification", arguments: notification)
        }
    }
}

extension NotificationPayload.Action: Codable {
    enum CodingKeys: String, CodingKey {
        case typeName = "__typename"
        case notification
    }
    
    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let typeName = try container.decode(String.self, forKey: .typeName)
        
        switch typeName {
        case "AddNotificationAction":
            let notification = try container.decode(Notification.self, forKey: .notification)
            self = .addNotification(notification: notification)
        default:
            throw DecodingError.dataCorruptedError(forKey: CodingKeys.typeName, in: container, debugDescription: "Expected one of AddNotificationAction – found \(typeName)")
        }
    }
    
    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        switch self {
        case .addNotification(let notification):
            try container.encode("AddNotificationAction", forKey: .typeName)
            try container.encode(notification, forKey: .notification)
        }
    }
}

