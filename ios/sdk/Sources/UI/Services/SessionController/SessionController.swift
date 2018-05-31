//
//  SessionController.swift
//  RoverUI
//
//  Created by Sean Rucker on 2018-05-21.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

public protocol SessionController: class {
    var delegate: SessionControllerDelegate? { get set }
    
    func startTracking()
    func stopTracking()
}
