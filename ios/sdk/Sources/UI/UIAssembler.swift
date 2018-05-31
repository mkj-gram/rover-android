//
//  UIAssembler.swift
//  RoverUI
//
//  Created by Sean Rucker on 2018-05-21.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

import SafariServices

public struct UIAssembler {
    public let sessionKeepAliveTime: Int
    
    public init(sessionKeepAliveTime: Int = 30) {
        self.sessionKeepAliveTime = sessionKeepAliveTime
    }
}

// MARK: Assembler

extension UIAssembler: Assembler {
    public func assemble(container: Container) {
        
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
        if let frameworksRegistry = resolver.resolve(FrameworksRegistry.self) {
            frameworksRegistry.register("io.rover.RoverUI")
        }
    }
}
