//
//  ErrorTrackerService.swift
//  RoverDebug
//
//  Created by Sean Rucker on 2018-06-25.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

import Foundation

class ErrorTrackerService: ErrorTracker {
    let eventQueue: EventQueue
    let logger: Logger
    
    var token: NSObjectProtocol?
    
    init(eventQueue: EventQueue, logger: Logger) {
        self.eventQueue = eventQueue
        self.logger = logger
    }
    
    func enable() {
        disable()
        
        token = logger.addObserver(block: { [weak self] (message, level) in
            if case .error = level {
                let attributes: Attributes = ["message": message]
                let event = EventInfo(name: "Error", namespace: "rover", attributes: attributes)
                self?.eventQueue.addEvent(event)
            }
        })
    }
    
    func disable() {
        guard let token = token else {
            return
        }
        
        logger.removeObserver(token)
    }
}
