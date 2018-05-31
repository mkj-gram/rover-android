//
//  UNNotificationRequest.swift
//  RoverNotifications
//
//  Created by Sean Rucker on 2018-03-11.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

extension UNNotificationRequest {
    public var action: Action? {
        guard let data = try? JSONSerialization.data(withJSONObject: content.userInfo, options: []) else {
            return nil
        }
        
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .formatted(DateFormatter.rfc3339)
        
        guard let payload = try? decoder.decode(NotificationPayload.self, from: data) else {
            return nil
        }
        
        return payload.action
    }
}
