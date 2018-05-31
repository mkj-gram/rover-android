//
//  DeepLinkAction.swift
//  RoverApplication
//
//  Created by Sean Rucker on 2018-05-12.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

public enum DeepLinkAction {
    case presentExperience(campaignID: ID)
    case presentNotificationCenter
}

// MARK: Action

extension DeepLinkAction: Action {
    public func operation(_ resolver: Resolver) -> RoverFoundation.Operation? {
        switch self {
        case .presentExperience(let campaignID):
            return resolver.resolve(Operation.self, name: "presentExperience", arguments: campaignID)
        case .presentNotificationCenter:
            return resolver.resolve(Operation.self, name: "presentNotificationCenter")
        }
    }
}
