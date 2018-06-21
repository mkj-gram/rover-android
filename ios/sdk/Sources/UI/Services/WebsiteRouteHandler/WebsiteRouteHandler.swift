//
//  WebsiteRouteHandler.swift
//  RoverUI
//
//  Created by Sean Rucker on 2018-06-19.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

import Foundation

class WebsiteRouteHandler: RouteHandler {
    let actionProvider: (URL) -> Action
    
    init(actionProvider: @escaping (URL) -> Action) {
        self.actionProvider = actionProvider
    }
    
    func deepLinkAction(url: URL) -> Action? {
        guard let host = url.host else {
            return nil
        }
        
        if host != "presentWebsite" {
            return nil
        }
        
        guard let components = URLComponents(url: url, resolvingAgainstBaseURL: false), let queryItem = components.queryItems?.first(where: { $0.name == "url" }), let value = queryItem.value?.removingPercentEncoding, let url = URL(string: value) else {
            return nil
        }
        
        return actionProvider(url)
    }
}
