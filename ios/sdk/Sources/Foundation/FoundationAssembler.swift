//
//  FoundationAssembler.swift
//  RoverFoundation
//
//  Created by Sean Rucker on 2017-10-24.
//  Copyright © 2017 Rover Labs Inc. All rights reserved.
//

public struct FoundationAssembler: Assembler {
    public var loggerThreshold: LogLevel
    
    public init(loggerThreshold: LogLevel = .warn) {
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
        
        // MARK: Logger
        
        container.register(Logger.self) { _ in
            return LoggerService(threshold: self.loggerThreshold)
        }
    }
    
    public func containerDidAssemble(resolver: Resolver) {
        let frameworksRegistry = resolver.resolve(FrameworksRegistry.self)!
        frameworksRegistry.register("io.rover.RoverFoundation")
    }
}
