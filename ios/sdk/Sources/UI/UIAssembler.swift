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
    
    public var isLifeCycleTrackingEnabled: Bool
    public var isVersionTrackingEnabled: Bool
    
    public init(associatedDomains: [String] = [], urlSchemes: [String] = [], sessionKeepAliveTime: Int = 30, isLifeCycleTrackingEnabled: Bool = true, isVersionTrackingEnabled: Bool = true) {
        self.associatedDomains = associatedDomains
        self.urlSchemes = urlSchemes
        self.sessionKeepAliveTime = sessionKeepAliveTime
        self.isLifeCycleTrackingEnabled = isLifeCycleTrackingEnabled
        self.isVersionTrackingEnabled = isVersionTrackingEnabled
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
        
        // MARK: ImageStore
        
        container.register(ImageStore.self) { resolver in
            let logger: Logger = resolver.resolve(Logger.self)!
            let session = URLSession(configuration: URLSessionConfiguration.ephemeral)
            return ImageStoreService(logger: logger, session: session)
        }
        
        // MARK: LifeCycleTracker
        
        container.register(LifeCycleTracker.self) { resolver in
            let eventQueue = resolver.resolve(EventQueue.self)!
            let sessionController = resolver.resolve(SessionController.self)!
            return LifeCycleTrackerService(eventQueue: eventQueue, sessionController: sessionController)
        }
        
        // MARK: Router
        
        container.register(Router.self) { resolver in
            let dispatcher = resolver.resolve(Dispatcher.self)!
            return RouterService(associatedDomains: self.associatedDomains, urlSchemes: self.urlSchemes, dispatcher: dispatcher)
        }
        
        // MARK: SessionController
        
        container.register(SessionController.self) { [sessionKeepAliveTime] resolver in
            let eventQueue = resolver.resolve(EventQueue.self)!
            return SessionControllerService(eventQueue: eventQueue, keepAliveTime: sessionKeepAliveTime)
        }
        
        // MARK: UIViewController (website)
        
        container.register(UIViewController.self, name: "website", scope: .transient) { (resolver, url: URL) in
            return SFSafariViewController(url: url)
        }
        
        // MARK: VersionTracker
        
        container.register(VersionTracker.self) { resolver in
            let eventQueue = resolver.resolve(EventQueue.self)!
            let logger = resolver.resolve(Logger.self)!
            return VersionTrackerService(bundle: Bundle.main, eventQueue: eventQueue, logger: logger, userDefaults: UserDefaults.standard)
        }
    }
    
    public func containerDidAssemble(resolver: Resolver) {
        if isVersionTrackingEnabled {
            resolver.resolve(VersionTracker.self)!.checkAppVersion()
        }
        
        if isLifeCycleTrackingEnabled {
            resolver.resolve(LifeCycleTracker.self)!.enable()
        }
    }
}
