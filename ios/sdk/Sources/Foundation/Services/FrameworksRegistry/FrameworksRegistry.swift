//
//  FrameworksRegistry.swift
//  RoverFoundation
//
//  Created by Sean Rucker on 2018-03-11.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

public protocol FrameworksRegistry {
    var versionMap: [String: String] { get }
    
    func register(_ identifier: String)
}
