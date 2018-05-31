//
//  GroupOperation.swift
//  RoverFoundation
//
//  Created by Sean Rucker on 2018-04-24.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

open class GroupOperation: Operation {
    private let internalQueue = OperationQueue()
    private let startingOperation = BlockOperation { }
    private let finishingOperation = BlockOperation { }
    
    private var aggregatedErrors = [Error]()
    
    public convenience init(operations: Operation...) {
        self.init(operations: operations)
    }
    
    public init(operations: [Operation]) {
        super.init()
        
        internalQueue.isSuspended = true
        internalQueue.delegate = self
        internalQueue.addOperation(startingOperation)
        
        operations.forEach {
            internalQueue.addOperation($0)
        }
    }
    
    override open func cancel() {
        internalQueue.cancelAllOperations()
        super.cancel()
    }
    
    override open func execute() {
        internalQueue.addOperation { [weak self] in
            self?.finish()
        }
        internalQueue.isSuspended = false
    }
    
    open func addOperation(operation: Operation) {
        internalQueue.addOperation(operation)
    }
}

// MARK: OperationQueueDelegate

extension GroupOperation: OperationQueueDelegate {
    func operationQueue(_ operationQueue: OperationQueue, willAddOperation operation: Foundation.Operation) {
        guard !finishingOperation.isFinished && !finishingOperation.isExecuting else {
            return
        }
        
        if operation !== finishingOperation {
            finishingOperation.addDependency(operation)
        }
        
        if operation !== startingOperation {
            operation.addDependency(startingOperation)
        }
    }
    
    func operationQueue(_ operationQueue: OperationQueue, operationDidFinish operation: Foundation.Operation, withErrors errors: [Error]) {
        aggregatedErrors.append(contentsOf: errors)
        
        if operation === finishingOperation {
            internalQueue.isSuspended = true
            finish(errors: aggregatedErrors)
        }
    }
}
