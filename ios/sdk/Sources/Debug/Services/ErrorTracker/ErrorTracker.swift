//
//  ErrorTracker.swift
//  RoverDebug
//
//  Created by Sean Rucker on 2018-06-25.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

import Foundation

public protocol ErrorTracker {
    func enable()
    func disable()
}
