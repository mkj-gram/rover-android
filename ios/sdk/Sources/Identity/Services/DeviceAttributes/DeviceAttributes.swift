//
//  DeviceAttributes.swift
//  RoverIdentity
//
//  Created by Sean Rucker on 2018-02-15.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

public protocol DeviceAttributes {
    func restore()
    func current() -> Attributes
    func update(_ block: (inout Attributes) -> Void)
    func clear()
}
