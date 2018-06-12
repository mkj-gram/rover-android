//
//  ApplicationMonitor.swift
//  RoverUI
//
//  Created by Sean Rucker on 2018-06-12.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

public protocol ApplicationMonitor {
    var isSessionTrackingEnabled: Bool { get set }
    var isVersionTrackingEnabled: Bool { get set }
}
