//
//  NavigationExperienceController.swift
//  RoverExperiences
//
//  Created by Sean Rucker on 2017-08-17.
//  Copyright © 2017 Rover Labs Inc. All rights reserved.
//

open class NavigationExperienceController: UINavigationController {
    public let experience: Experience
    public let eventQueue: EventQueue?
    public let sessionController: SessionController
    
    public init(rootViewController: UIViewController, experience: Experience, eventQueue: EventQueue?, sessionController: SessionController) {
        self.experience = experience
        self.eventQueue = eventQueue
        self.sessionController = sessionController
        
        super.init(nibName: nil, bundle: nil)
        viewControllers = [rootViewController]
        
        sessionController.delegate = self
    }
    
    required public init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override open func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        sessionController.startTracking()
    }
    
    override open func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        sessionController.stopTracking()
    }
    
    override open var childViewControllerForStatusBarStyle: UIViewController? {
        return self.topViewController
    }
}

// MARK: SessionControllerDelegate

extension NavigationExperienceController: SessionControllerDelegate {
    private func sessionEvent(named name: String, sessionID: UUID) -> EventInfo {
        var attributes: Attributes = [
            "sessionID": sessionID.uuidString,
            "experienceID": experience.id.rawValue
        ]
        
        if let campaignID = experience.campaignID {
            attributes["campaignID"] = campaignID.rawValue
        }
        
        return EventInfo(name: name, namespace: "rover", attributes: attributes)
    }
    
    public func sessionController(_ sessionController: SessionController, didStartSession sessionID: UUID) {
        guard let eventQueue = eventQueue else {
            return
        }
        
        let event = sessionEvent(named: "Experience Presented", sessionID: sessionID)
        eventQueue.addEvent(event)
    }
    
    public func sessionController(_ sessionController: SessionController, didEndSession sessionID: UUID) {
        guard let eventQueue = eventQueue else {
            return
        }
        
        let event = sessionEvent(named: "Experience Dismissed", sessionID: sessionID)
        eventQueue.addEvent(event)
    }
}
