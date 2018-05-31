//
//  ApplicationAssembler.swift
//  RoverApplication
//
//  Created by Sean Rucker on 2018-05-16.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

fileprivate typealias Operation = RoverFoundation.Operation

public struct ApplicationAssembler: Assembler {
    public var associatedDomains: [String]
    public var isForegroundFetchingEnabled: Bool
    public var isSessionTrackingEnabled: Bool
    public var urlSchemes: [String]
    
    public init(associatedDomains: [String], urlSchemes: [String], isForegroundFetchingEnabled: Bool = true, isSessionTrackingEnabled: Bool = true) {
        self.associatedDomains = associatedDomains
        self.urlSchemes = urlSchemes
        self.isForegroundFetchingEnabled = isForegroundFetchingEnabled
        self.isSessionTrackingEnabled = isSessionTrackingEnabled
    }
    
    public func assemble(container: Container) {
        
        // MARK: ApplicationHandler
        
        container.register(ApplicationHandler.self) { resolver in
            let dispatcher = resolver.resolve(Dispatcher.self)!
            return ApplicationHandlerService(associatedDomains: self.associatedDomains, urlSchemes: self.urlSchemes, dispatcher: dispatcher)
        }
        
        // MARK: BackgroundFetcher
        
        container.register(BackgroundFetcher.self) { resolver in
            let stateFetcher = resolver.resolve(StateFetcher.self)!
            return BackgroundFetcherService(stateFetcher: stateFetcher)
        }
        
        // MARK: ContextProvider (pushToken)
        
        container.register(ContextProvider.self, name: "pushToken") { resolver in
            let tokenManager = resolver.resolve(TokenManager.self)!
            return PushTokenContextProvider(tokenManager: tokenManager)
        }
        
        // MARK: ForegroundFetcher
        
        container.register(ForegroundFetcher.self) { resolver in
            let stateFetcher = resolver.resolve(StateFetcher.self)!
            return ForegroundFetcherService(stateFetcher: stateFetcher)
        }
        
        // MARK: SessionTracker
        
        container.register(SessionTracker.self) { resolver in
            let eventQueue = resolver.resolve(EventQueue.self)!
            let sessionController = resolver.resolve(SessionController.self)!
            return SessionTrackerService(eventQueue: eventQueue, sessionController: sessionController)
        }
        
        // MARK: TokenManager
        
        container.register(TokenManager.self) { resolver in
            let eventQueue = resolver.resolve(EventQueue.self)
            let logger = resolver.resolve(Logger.self)!
            return TokenManagerService(eventQueue: eventQueue, logger: logger, userDefaults: UserDefaults.standard)
        }
        
        // MARK: VersionTracker
        
        container.register(VersionTracker.self) { resolver in
            let eventQueue = resolver.resolve(EventQueue.self)!
            let logger = resolver.resolve(Logger.self)!
            return VersionTrackerService(bundle: Bundle.main, eventQueue: eventQueue, logger: logger, userDefaults: UserDefaults.standard)
        }
    }
    
    public func containerDidAssemble(resolver: Resolver) {
        if isForegroundFetchingEnabled {
            let foregroundFetcher = resolver.resolve(ForegroundFetcher.self)!
            foregroundFetcher.startMonitoring()
        }
        
        if isSessionTrackingEnabled {
            let sessionTracker = resolver.resolve(SessionTracker.self)!
            sessionTracker.startMonitoring()
        }
        
        if let eventQueue = resolver.resolve(EventQueue.self) {
            let contextProvider = resolver.resolve(ContextProvider.self, name: "pushToken")!
            eventQueue.addContextProviders(contextProvider)
        }
        
        let versionTracker = resolver.resolve(VersionTracker.self)!
        versionTracker.trackAppVersion()
    }
}
