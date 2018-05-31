//
//  UNNotificationResponse.swift
//  RoverNotifications
//
//  Created by Sean Rucker on 2018-05-09.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

extension UNNotificationResponse {
    public var action: Action? {
        return notification.request.action
    }
}
