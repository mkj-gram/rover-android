//
//  UniversalLinkAction.swift
//  RoverApplication
//
//  Created by Sean Rucker on 2018-05-15.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

public struct UniversalLinkAction {
    public let url: URL
    
    public init(url: URL) {
        self.url = url
    }
}

// MARK: Action

extension UniversalLinkAction: Action {
    public func operation(_ resolver: Resolver) -> RoverFoundation.Operation? {
        return resolver.resolve(Operation.self, name: "universalLink", arguments: url)
    }
}
