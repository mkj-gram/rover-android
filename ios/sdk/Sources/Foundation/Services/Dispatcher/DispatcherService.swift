//
//  DispatcherService.swift
//  RoverFoundation
//
//  Created by Sean Rucker on 2018-05-10.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

public struct DispatcherService: Dispatcher {
    let logger: Logger
    let operationQueue: OperationQueue
    let resolver: Resolver
    
    init(logger: Logger, operationQueue: OperationQueue, resolver: Resolver) {
        self.logger = logger
        self.operationQueue = operationQueue
        self.resolver = resolver
    }
    
    public func dispatch(_ action: Action) -> Operation? {
        guard let operation = action.operation(resolver) else {
            logger.warn("No operation found for action \(action)")
            return nil
        }
        
        operationQueue.addOperation(operation)
        return operation
    }
}
