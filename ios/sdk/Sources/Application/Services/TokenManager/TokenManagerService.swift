//
//  TokenManagerService.swift
//  RoverApplication
//
//  Created by Sean Rucker on 2018-02-08.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

class TokenManagerService: TokenManager {
    let eventQueue: EventQueue?
    let logger: Logger
    let userDefaults: UserDefaults
    
    internal private(set) var pushToken: String?
    
    init(eventQueue: EventQueue?, logger: Logger, userDefaults: UserDefaults) {
        self.eventQueue = eventQueue
        self.logger = logger
        self.userDefaults = userDefaults
    }
    
    func setToken(_ data: Data) {
        let pushToken = data.map { String(format: "%02.2hhx", $0) }.joined()
        self.pushToken = pushToken
        
        if let previousToken = userDefaults.string(forKey: "io.rover.pushToken") {
            if pushToken != previousToken {
                logger.debug("Current and previous tokens do not match – push token updated")
                trackPushTokenUpdated(currentToken: pushToken, previousToken: previousToken)
            }
        } else {
            logger.debug("Previous token not found - push token added")
            trackPushTokenAdded(currentToken: pushToken)
        }
        
        userDefaults.set(pushToken, forKey: "io.rover.pushToken")
    }
    
    func trackPushTokenUpdated(currentToken: String, previousToken: String) {
        guard let eventQueue = eventQueue else {
            return
        }
        
        let attributes: Attributes = ["currentToken": currentToken, "previousToken": previousToken]
        let event = EventInfo(name: "Push Token Updated", namespace: "rover", attributes: attributes)
        eventQueue.addEvent(event)
    }
    
    func trackPushTokenAdded(currentToken: String) {
        guard let eventQueue = eventQueue else {
            return
        }
        
        let attributes: Attributes = ["currentToken": currentToken]
        let event = EventInfo(name: "Push Token Added", namespace: "rover", attributes: attributes)
        eventQueue.addEvent(event)
    }
    
    func removeToken() {
        self.pushToken = nil
        
        if let previousToken = userDefaults.string(forKey: "io.rover.pushToken") {
            logger.debug("Previous token found - push token removed")
            trackPushTokenRemoved(previousToken: previousToken)
        }
        
        userDefaults.removeObject(forKey: "io.rover.pushToken")
    }
    
    func trackPushTokenRemoved(previousToken: String) {
        guard let eventQueue = eventQueue else {
            return
        }
        
        let attributes: Attributes = ["previousToken": previousToken]
        let event = EventInfo(name: "Push Token Removed", namespace: "rover", attributes: attributes)
        eventQueue.addEvent(event)
    }
}
