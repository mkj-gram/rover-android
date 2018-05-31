//
//  ApplicationHandlerService.swift
//  RoverApplication
//
//  Created by Sean Rucker on 2018-04-22.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

struct ApplicationHandlerService: ApplicationHandler {
    let associatedDomains: [String]
    let urlSchemes: [String]
    let dispatcher: Dispatcher
    
    init(associatedDomains: [String], urlSchemes: [String], dispatcher: Dispatcher) {
        self.associatedDomains = associatedDomains
        self.urlSchemes = urlSchemes
        self.dispatcher = dispatcher
    }
    
    func handle(_ userActivity: NSUserActivity) -> Bool {
        guard let action = action(for: userActivity) else {
            return false
        }
        
        dispatcher.dispatch(action)
        return true
    }
    
    func action(for userActivity: NSUserActivity) -> Action? {
        guard userActivity.activityType == NSUserActivityTypeBrowsingWeb, let url = userActivity.webpageURL else {
            return nil
        }
        
        return action(for: url)
    }
    
    func handle(_ url: URL) -> Bool {
        guard let action = action(for: url) else {
            return false
        }

        dispatcher.dispatch(action)
        return true
    }
    
    func action(for url: URL) -> Action? {
        return universalLinkAction(url: url) ?? deepLinkAction(url: url)
    }
    
    func universalLinkAction(url: URL) -> Action? {
        guard let scheme = url.scheme, ["http", "https"].contains(scheme) else {
            return nil
        }

        guard let host = url.host, associatedDomains.contains(host) else {
            return nil
        }
        
        return UniversalLinkAction(url: url)
    }

    func deepLinkAction(url: URL) -> Action? {
        guard let scheme = url.scheme, urlSchemes.contains(scheme) else {
            return nil
        }

        guard let host = url.host, let components = URLComponents(url: url, resolvingAgainstBaseURL: false) else {
            return nil
        }

        switch host {
        case "presentExperience":
            guard let queryItem = components.queryItems?.first(where: { $0.name == "campaignID" }), let value = queryItem.value else {
                return nil
            }
            
            let campaignID = ID(rawValue: value)
            return DeepLinkAction.presentExperience(campaignID: campaignID)
        case "presentNotificationCenter":
            return DeepLinkAction.presentNotificationCenter
        default:
            return nil
        }
    }
}
