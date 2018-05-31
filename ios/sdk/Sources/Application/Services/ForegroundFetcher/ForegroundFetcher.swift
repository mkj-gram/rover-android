//
//  ForegroundFetcher.swift
//  RoverApplication
//
//  Created by Sean Rucker on 2018-05-22.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

public protocol ForegroundFetcher {
    func startMonitoring()
    func stopMonitoring()
}
