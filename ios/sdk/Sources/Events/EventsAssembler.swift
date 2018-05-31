//
//  EventsAssembler.swift
//  RoverEvents
//
//  Created by Sean Rucker on 2018-05-16.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

public struct EventsAssembler: Assembler {
    public var flushAt: Int
    public var flushInterval: Double
    public var maxBatchSize: Int
    public var maxQueueSize: Int
    
    public init(flushAt: Int = 20, flushInterval: Double = 30.0, maxBatchSize: Int = 100, maxQueueSize: Int = 1000) {
        self.flushAt = flushAt
        self.flushInterval = flushInterval
        self.maxBatchSize = maxBatchSize
        self.maxQueueSize = maxQueueSize
    }
    
    public func assemble(container: Container) {
        
        // MARK: ContextProvider (app)
        
        container.register(ContextProvider.self, name: "app") { resolver in
            let logger = resolver.resolve(Logger.self)!
            return AppContextProvider(bundle: Bundle.main, logger: logger)
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
        
        // MARK: ContextProvider (reachability)
        
        container.register(ContextProvider.self, name: "reachability") { resolver in
            let logger = resolver.resolve(Logger.self)!
            return ReachabilityContextProvider(logger: logger)
        }
        
        // MARK: ContextProvider (screen)
        
        container.register(ContextProvider.self, name: "screen") { resolver in
            return ScreenContextProvider(screen: UIScreen.main)
        }
        
        // MARK: ContextProvider (telephony)
        
        container.register(ContextProvider.self, name: "telephony") { resolver in
            let logger = resolver.resolve(Logger.self)!
            return TelephonyContextProvider(logger: logger)
        }
        
        // MARK: ContextProvider (timeZone)
        
        container.register(ContextProvider.self, name: "timeZone") { resolver in
            let timeZone = NSTimeZone.local as NSTimeZone
            return TimeZoneContextProvider(timeZone: timeZone)
        }
        
        // MARK: EventQueue
        
        container.register(EventQueue.self) { [flushAt, flushInterval, maxBatchSize, maxQueueSize] resolver in
            let client = resolver.resolve(APIClient.self)!
            let logger = resolver.resolve(Logger.self)!
            return EventQueueService(client: client, flushAt: flushAt, flushInterval: flushInterval, logger: logger, maxBatchSize: maxBatchSize, maxQueueSize: maxQueueSize)
        }
    }
    
    public func containerDidAssemble(resolver: Resolver) {
        let eventQueue = resolver.resolve(EventQueue.self)!
        eventQueue.addContextProviders([
            resolver.resolve(ContextProvider.self, name: "app")!,
            resolver.resolve(ContextProvider.self, name: "device")!,
            resolver.resolve(ContextProvider.self, name: "frameworks")!,
            resolver.resolve(ContextProvider.self, name: "locale")!,
            resolver.resolve(ContextProvider.self, name: "pushEnvironment")!,
            resolver.resolve(ContextProvider.self, name: "reachability")!,
            resolver.resolve(ContextProvider.self, name: "screen")!,
            resolver.resolve(ContextProvider.self, name: "telephony")!,
            resolver.resolve(ContextProvider.self, name: "timeZone")!
        ])
        
        eventQueue.restore()
    }
}
