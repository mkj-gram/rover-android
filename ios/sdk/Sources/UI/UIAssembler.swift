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
        
        // MARK: Operation (openURL)
        
        container.register(Operation.self, name: "openURL", scope: .transient) { (resolver, url: URL) in
            return OpenURLOperation(url: url)
        }
        
        // MARK: Operation (presentWebsite)
        
        container.register(Operation.self, name: "presentWebsite", scope: .transient) { (resolver, url: URL) in
            let viewControllerToPresent = resolver.resolve(UIViewController.self, name: "website", arguments: url)!
            let logger = resolver.resolve(Logger.self)!
            return PresentViewOperation(viewControllerToPresent: viewControllerToPresent, animated: true, logger: logger)
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
    }
}
