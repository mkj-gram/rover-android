//
//  PresentNotificationCenterAction.swift
//  RoverNotifications
//
//  Created by Sean Rucker on 2018-05-14.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

import Foundation

public struct PresentNotificationCenterAction {
    public init() { }
}

// MARK: Action

extension PresentNotificationCenterAction: Action {
    public func operation(_ resolver: Resolver) -> Operation? {
        return resolver.resolve(Operation.self, name: "presentNotificationCenter")
    }
}
