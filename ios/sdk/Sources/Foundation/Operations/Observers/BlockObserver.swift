//
//  BlockObserver.swift
//  RoverFoundation
//
//  Created by Sean Rucker on 2018-05-10.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

import Foundation

public struct BlockObserver: OperationObserver {
    public typealias StartHandler = (AsynchronousOperation) -> Void
    public typealias ProduceHandler = (AsynchronousOperation, Operation) -> Void
    public typealias FinishHandler = (AsynchronousOperation, [Error]) -> Void
    
    private let startHandler: StartHandler?
    private let produceHandler: ProduceHandler?
    private let finishHandler: FinishHandler?
    
    public init(startHandler: StartHandler? = nil, produceHandler: ProduceHandler? = nil, finishHandler: FinishHandler? = nil) {
        self.startHandler = startHandler
        self.produceHandler = produceHandler
        self.finishHandler = finishHandler
    }
    
    public func operationDidStart(_ operation: AsynchronousOperation) {
        startHandler?(operation)
    }
    
    public func operation(_ operation: AsynchronousOperation, didProduceOperation newOperation: Operation) {
        produceHandler?(operation, newOperation)
    }
    
    public func operationDidFinish(_ operation: AsynchronousOperation, errors: [Error]) {
        finishHandler?(operation, errors)
    }
}
