//
//  SessionControllerService.swift
//  RoverUI
//
//  Created by Sean Rucker on 2018-05-21.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

class SessionControllerService {
    let keepAliveTime: Int
    
    weak var delegate: SessionControllerDelegate?
    
    var sessionID = UUID()
    var lastSessionEndedAt: Date?
    
    var applicationDidBecomeActiveToken: NSObjectProtocol?
    var applicationWillResignActiveToken: NSObjectProtocol?
    
    init(keepAliveTime: Int) {
        self.keepAliveTime = keepAliveTime
    }
}

// MARK: SessionController

extension SessionControllerService: SessionController {
    func startTracking() {
        if UIApplication.shared.applicationState == .active {
            startSession()
        }
        
        addApplicationObservers()
    }
    
    func stopTracking() {
        endSession()
        removeApplicationObservers()
    }
}

// MARK: Session Management

extension SessionControllerService {
    func startSession() {
        sessionID = refreshSessionID()
        delegate?.sessionController(self, didStartSession: sessionID)
    }
    
    func refreshSessionID() -> UUID {
        guard let lastSessionEndedAt = lastSessionEndedAt else {
            return UUID()
        }
        
        let now = Date().timeIntervalSince1970
        if now - lastSessionEndedAt.timeIntervalSince1970 > TimeInterval(keepAliveTime) {
            return UUID()
        }
        
        return sessionID
    }
    
    func endSession() {
        lastSessionEndedAt = Date()
        delegate?.sessionController(self, didEndSession: sessionID)
    }
}


// MARK: Application Observers

extension SessionControllerService {
    func addApplicationObservers() {
        applicationDidBecomeActiveToken = NotificationCenter.default.addObserver(forName: .UIApplicationDidBecomeActive, object: nil, queue: nil) { _ in
            self.startSession()
        }
        
        applicationWillResignActiveToken = NotificationCenter.default.addObserver(forName: .UIApplicationWillResignActive, object: nil, queue: nil) { _ in
            self.endSession()
        }
    }
    
    func removeApplicationObservers() {
        if let applicationDidBecomeActiveToken = applicationDidBecomeActiveToken {
            NotificationCenter.default.removeObserver(applicationDidBecomeActiveToken)
        }
        
        if let applicationWillResignActiveToken = applicationWillResignActiveToken {
            NotificationCenter.default.removeObserver(applicationWillResignActiveToken)
        }
    }
}
