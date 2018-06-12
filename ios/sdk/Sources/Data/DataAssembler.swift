//
//  DataAssembler.swift
//  RoverData
//
//  Created by Sean Rucker on 2018-06-01.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

public struct DataAssembler: Assembler {
    public var accountToken: String
    public var endpoint: URL
    
    public var flushAt: Int
    public var flushInterval: Double
    public var maxBatchSize: Int
    public var maxQueueSize: Int
    
    public var isAutoFetchEnabled: Bool
    
    public init(accountToken: String, endpoint: URL = URL(string: "https://api.rover.io/graphql")!, flushAt: Int = 20, flushInterval: Double = 30.0, maxBatchSize: Int = 100, maxQueueSize: Int = 1000, isAutoFetchEnabled: Bool = true) {
        self.accountToken = accountToken
        self.endpoint = endpoint
        
        self.flushAt = flushAt
        self.flushInterval = flushInterval
        self.maxBatchSize = maxBatchSize
        self.maxQueueSize = maxQueueSize
        
        self.isAutoFetchEnabled = isAutoFetchEnabled
    }
    
    public func assemble(container: Container) {
        
        // MARK: GraphQLClient
        
        container.register(GraphQLClient.self) { [accountToken, endpoint] resolver in
            let session = URLSession(configuration: URLSessionConfiguration.default)
            return GraphQLClientService(accountToken: accountToken, endpoint: endpoint, session: session)
        }
        
        // MARK: ContextProvider (app)
        
        container.register(ContextProvider.self, name: "app") { resolver in
            let logger = resolver.resolve(Logger.self)!
            return AppContextProvider(bundle: Bundle.main, logger: logger)
        }
        
        // MARK: ContextProvider (attributes)
        
        container.register(ContextProvider.self, name: "attributes") { resolver in
            let deviceAttributes = resolver.resolve(DeviceAttributes.self)!
            return AttributesContextProvider(deviceAttributes: deviceAttributes)
        }
        
        // MARK: ContextProvider (device)
        
        container.register(ContextProvider.self, name: "device") { resolver in
            let logger = resolver.resolve(Logger.self)!
            return DeviceContextProvider(device: UIDevice.current, logger: logger)
        }
        
        // MARK: ContextProvider (frameworks)
        
        container.register(ContextProvider.self, name: "frameworks") { resolver in
            let registry = resolver.resolve(FrameworksRegistry.self)!
            return FrameworksContextProvider(registry: registry)
        }
        
        // MARK: ContextProvider (locale)
        
        container.register(ContextProvider.self, name: "locale") { resolver in
            let logger = resolver.resolve(Logger.self)!
            return LocaleContextProvider(locale: Locale.current, logger: logger)
        }
        
        // MARK: ContextProvider (pushEnvironment)
        
        container.register(ContextProvider.self, name: "pushEnvironment") { resolver in
            let logger = resolver.resolve(Logger.self)!
            return PushEnvironmentContextProvider(bundle: Bundle.main, logger: logger)
        }
        
        // MARK: ContextProvider (pushToken)
        
        container.register(ContextProvider.self, name: "pushToken") { resolver in
            let tokenManager = resolver.resolve(TokenManager.self)!
            return PushTokenContextProvider(tokenManager: tokenManager)
        }
        
        // MARK: ContextProvider (reachability)
        
        container.register(ContextProvider.self, name: "reachability") { resolver in
            let logger = resolver.resolve(Logger.self)!
            return ReachabilityContextProvider(logger: logger)
        }
        
        // MARK: ContextProvider (screen)
        
        container.register(ContextProvider.self, name: "screen") { resolver in
            return ScreenContextProvider(screen: UIScreen.main)
        }
        
        // MARK: ContextProvider (timeZone)
        
        container.register(ContextProvider.self, name: "timeZone") { resolver in
            let timeZone = NSTimeZone.local as NSTimeZone
            return TimeZoneContextProvider(timeZone: timeZone)
        }
        
        // MARK: DeviceAttributes
        
        container.register(DeviceAttributes.self) { resolver in
            let eventQueue = resolver.resolve(EventQueue.self)!
            let logger = resolver.resolve(Logger.self)!
            return DeviceAttributesService(eventQueue: eventQueue, logger: logger, userDefaults: UserDefaults.standard)
        }
        
        // MARK: EventQueue
        
        container.register(EventQueue.self) { [flushAt, flushInterval, maxBatchSize, maxQueueSize] resolver in
            let client = resolver.resolve(GraphQLClient.self)!
            let logger = resolver.resolve(Logger.self)!
            return EventQueueService(client: client, flushAt: flushAt, flushInterval: flushInterval, logger: logger, maxBatchSize: maxBatchSize, maxQueueSize: maxQueueSize)
        }
        
        // MARK: StateFetcher
        
        container.register(StateFetcher.self) { resolver in
            let client = resolver.resolve(GraphQLClient.self)!
            let logger = resolver.resolve(Logger.self)!
            return StateFetcherService(client: client, logger: logger)
        }
        
        // MARK: TokenManager
        
        container.register(TokenManager.self) { resolver in
            let eventQueue = resolver.resolve(EventQueue.self)
            let logger = resolver.resolve(Logger.self)!
            return TokenManagerService(eventQueue: eventQueue, logger: logger, userDefaults: UserDefaults.standard)
        }
    }
    
    public func containerDidAssemble(resolver: Resolver) {
        let deviceAttributes = resolver.resolve(DeviceAttributes.self)!
        deviceAttributes.restore()
        
        let eventQueue = resolver.resolve(EventQueue.self)!
        let contextProviders = [
            resolver.resolve(ContextProvider.self, name: "app"),
            resolver.resolve(ContextProvider.self, name: "attributes"),
            resolver.resolve(ContextProvider.self, name: "bluetooth"),
            resolver.resolve(ContextProvider.self, name: "device"),
            resolver.resolve(ContextProvider.self, name: "frameworks"),
            resolver.resolve(ContextProvider.self, name: "locale"),
            resolver.resolve(ContextProvider.self, name: "location"),
            resolver.resolve(ContextProvider.self, name: "notificationAuthorization"),
            resolver.resolve(ContextProvider.self, name: "pushEnvironment"),
            resolver.resolve(ContextProvider.self, name: "pushToken"),
            resolver.resolve(ContextProvider.self, name: "reachability"),
            resolver.resolve(ContextProvider.self, name: "screen"),
            resolver.resolve(ContextProvider.self, name: "telephony"),
            resolver.resolve(ContextProvider.self, name: "timeZone")
            ].compactMap { $0 }
        
        eventQueue.addContextProviders(contextProviders)
        eventQueue.restore()
        
        let frameworksRegistry = resolver.resolve(FrameworksRegistry.self)!
        frameworksRegistry.register("io.rover.RoverData")
        
        var stateFetcher = resolver.resolve(StateFetcher.self)!
        stateFetcher.isAutoFetchEnabled = isAutoFetchEnabled
    }
}
