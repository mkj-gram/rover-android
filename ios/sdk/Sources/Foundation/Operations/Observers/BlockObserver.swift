//
//  BlockObserver.swift
//  RoverFoundation
//
//  Created by Sean Rucker on 2018-05-10.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

public struct BlockObserver: OperationObserver {
    public typealias StartHandler = (Operation) -> Void
    public typealias ProduceHandler = (Operation, Foundation.Operation) -> Void
    public typealias FinishHandler = (Operation, [Error]) -> Void
    
    private let startHandler: StartHandler?
    private let produceHandler: ProduceHandler?
    private let finishHandler: FinishHandler?
    
    public init(startHandler: StartHandler? = nil, produceHandler: ProduceHandler? = nil, finishHandler: FinishHandler? = nil) {
        self.startHandler = startHandler
        self.produceHandler = produceHandler
        self.finishHandler = finishHandler
    }
    
    public func operationDidStart(_ operation: Operation) {
        startHandler?(operation)
    }
    
    public func operation(_ operation: Operation, didProduceOperation newOperation: Foundation.Operation) {
        produceHandler?(operation, newOperation)
    }
    
    public func operationDidFinish(_ operation: Operation, errors: [Error]) {
        finishHandler?(operation, errors)
    }
}
