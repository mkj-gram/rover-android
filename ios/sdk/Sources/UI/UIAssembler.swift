//
//  UIAssembler.swift
//  RoverUI
//
//  Created by Sean Rucker on 2018-05-21.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

import SafariServices

public struct UIAssembler {
    public var associatedDomains: [String]
    public var urlSchemes: [String]
    
    public var sessionKeepAliveTime: Int
    
    public var isApplicationSessionTrackingEnabled: Bool
    public var isApplicationVersionTrackingEnabled: Bool
    
    public init(associatedDomains: [String] = [], urlSchemes: [String] = [], sessionKeepAliveTime: Int = 30, isApplicationSessionTrackingEnabled: Bool = true, isApplicationVersionTrackingEnabled: Bool = true) {
        self.associatedDomains = associatedDomains
        self.urlSchemes = urlSchemes
        self.sessionKeepAliveTime = sessionKeepAliveTime
        self.isApplicationSessionTrackingEnabled = isApplicationSessionTrackingEnabled
        self.isApplicationVersionTrackingEnabled = isApplicationVersionTrackingEnabled
    }
}

// MARK: Assembler

extension UIAssembler: Assembler {
    public func assemble(container: Container) {
        
        // MARK: Action (openURL)
        
        container.register(Action.self, name: "openURL", scope: .transient) { (resolver, url: URL) in
            return OpenURLAction(url: url)
        }
        
        // MARK: Action (presentView)
        
        container.register(Action.self, name: "presentView", scope: .transient) { (resolver, viewControllerToPresent: UIViewController) in
            let logger = resolver.resolve(Logger.self)!
            return PresentViewAction(viewControllerToPresent: viewControllerToPresent, animated: true, logger: logger)
        }
        
        // MARK: Action (presentWebsite)
        
        container.register(Action.self, name: "presentWebsite", scope: .transient) { (resolver, url: URL) in
            let viewControllerToPresent = resolver.resolve(UIViewController.self, name: "website", arguments: url)!
            return resolver.resolve(Action.self, name: "presentView", arguments: viewControllerToPresent)!
        }
        
        // MARK: ApplicationMonitor
        
        container.register(ApplicationMonitor.self) { resolver in
            let eventQueue = resolver.resolve(EventQueue.self)!
            let logger = resolver.resolve(Logger.self)!
            let sessionController = resolver.resolve(SessionController.self)!
            return ApplicationMonitorService(bundle: Bundle.main, eventQueue: eventQueue, logger: logger, sessionController: sessionController, userDefaults: UserDefaults.standard)
        }
        
        // MARK: ImageStore
        
        container.register(ImageStore.self) { resolver in
            let logger: Logger = resolver.resolve(Logger.self)!
            let session = URLSession(configuration: URLSessionConfiguration.ephemeral)
            return ImageStoreService(logger: logger, session: session)
        }
        
        // MARK: RouteHandler (website)
        
        container.register(RouteHandler.self, name: "website") { resolver in
            return WebsiteRouteHandler(actionProvider: { url in
                return resolver.resolve(Action.self, name: "presentWebsite", arguments: url)!
            })
        }
        
        // MARK: Router
        
        container.register(Router.self) { resolver in
            let dispatcher = resolver.resolve(Dispatcher.self)!
            return RouterService(associatedDomains: self.associatedDomains, urlSchemes: self.urlSchemes, dispatcher: dispatcher)
        }
        
        // MARK: SessionController
        
        container.register(SessionController.self, scope: .transient) { [sessionKeepAliveTime] _ in
            return SessionControllerService(keepAliveTime: sessionKeepAliveTime)
        }
        
        // MARK: UIViewController (website)
        
        container.register(UIViewController.self, name: "website", scope: .transient) { (resolver, url: URL) in
            return SFSafariViewController(url: url)
        }
    }
    
    public func containerDidAssemble(resolver: Resolver) {
        var applicationMonitor = resolver.resolve(ApplicationMonitor.self)!
        applicationMonitor.isSessionTrackingEnabled = isApplicationSessionTrackingEnabled
        applicationMonitor.isVersionTrackingEnabled = isApplicationVersionTrackingEnabled
        
        let handler = resolver.resolve(RouteHandler.self, name: "website")!
        let router = resolver.resolve(Router.self)!
        router.addHandler(handler)
    }
}
