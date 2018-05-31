//
//  Action.swift
//  RoverFoundation
//
//  Created by Sean Rucker on 2018-05-09.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

public protocol Action {
    func operation(_ resolver: Resolver) -> Operation?
}
