//
//  ApplicationHandler.swift
//  RoverApplication
//
//  Created by Sean Rucker on 2018-04-22.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

public protocol ApplicationHandler {
    func handle(_ userActivity: NSUserActivity) -> Bool
    func action(for userActivity: NSUserActivity) -> Action?
    func handle(_ url: URL) -> Bool
    func action(for url: URL) -> Action?
}
