//
//  FoundationAssembler.swift
//  RoverFoundation
//
//  Created by Sean Rucker on 2017-10-24.
//  Copyright © 2017 Rover Labs Inc. All rights reserved.
//

public struct FoundationAssembler: Assembler {
    public var accountToken: String
    public var endpoint: URL
    public var loggerThreshold: LogLevel
    
    public init(accountToken: String, endpoint: URL = URL(string: "https://api.rover.io/graphql")!, loggerThreshold: LogLevel = .warn) {
        self.accountToken = accountToken
        self.endpoint = endpoint
        self.loggerThreshold = loggerThreshold
    }

    public func assemble(container: Container) {
        
        // MARK: Dispatcher
        
        container.register(Dispatcher.self) { resolver in
            let logger = resolver.resolve(Logger.self)!
            let operationQueue = OperationQueue()
            return DispatcherService(logger: logger, operationQueue: operationQueue, resolver: resolver)
        }
        
        // MARK: FrameworksRegistry
        
        container.register(FrameworksRegistry.self) { resolver in
            let logger = resolver.resolve(Logger.self)!
            return FrameworksRegistryService(logger: logger)
        }
        
        // MARK: APIClient
        
        container.register(APIClient.self) { [accountToken, endpoint] resolver in
            let session = URLSession(configuration: URLSessionConfiguration.default)
            return APIClientService(accountToken: accountToken, endpoint: endpoint, session: session)
        }
        
        // MARK: Logger
        
        container.register(Logger.self) { _ in
            return LoggerService(threshold: self.loggerThreshold)
        }
        
        // MARK: StateFetcher
        
        container.register(StateFetcher.self) { resolver in
            let client = resolver.resolve(APIClient.self)!
            let logger = resolver.resolve(Logger.self)!
            return StateFetcherService(client: client, logger: logger)
        }
    }
    
    public func containerDidAssemble(resolver: Resolver) {
        let frameworksRegistry = resolver.resolve(FrameworksRegistry.self)!
        frameworksRegistry.register("io.rover.RoverFoundation")
    }
}
