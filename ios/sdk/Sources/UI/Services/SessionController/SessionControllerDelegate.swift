//
//  SessionControllerDelegate.swift
//  RoverUI
//
//  Created by Sean Rucker on 2018-05-21.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

import Foundation

public protocol SessionControllerDelegate: class {
    func sessionController(_ sessionController: SessionController, didStartSession sessionID: UUID)
    func sessionController(_ sessionController: SessionController, didEndSession sessionID: UUID)
}
