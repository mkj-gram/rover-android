//
//  SessionTrackerService.swift
//  RoverApplication
//
//  Created by Sean Rucker on 2018-05-22.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

class SessionTrackerService: SessionTracker {
    let eventQueue: EventQueue
    let sessionController: SessionController
    
    init(eventQueue: EventQueue, sessionController: SessionController) {
        self.eventQueue = eventQueue
        self.sessionController = sessionController
        sessionController.delegate = self
    }
    
    func startMonitoring() {
        sessionController.startTracking()
    }
    
    func stopMonitoring() {
        sessionController.stopTracking()
    }
}

// MARK: SessionControllerDelegate

extension SessionTrackerService: SessionControllerDelegate {
    func sessionController(_ sessionController: SessionController, didStartSession sessionID: UUID) {
        let attributes: Attributes = ["sessionID": sessionID.uuidString]
        let event = EventInfo(name: "App Opened", namespace: "rover", attributes: attributes)
        eventQueue.addEvent(event)
    }
    
    func sessionController(_ sessionController: SessionController, didEndSession sessionID: UUID) {
        let attributes: Attributes = ["sessionID": sessionID.uuidString]
        let event = EventInfo(name: "App Closed", namespace: "rover", attributes: attributes)
        eventQueue.addEvent(event)
    }
}
