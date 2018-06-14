//
//  OperationQueue.swift
//  RoverFoundation
//
//  Created by Sean Rucker on 2018-05-10.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

import Foundation

/**
 `OperationQueue` is a `Foundation.OperationQueue` subclass that adds the ability to notify a delegate when operations finish.
 */
public class OperationQueue: Foundation.OperationQueue {
    weak var delegate: OperationQueueDelegate?
    
    override public func addOperation(_ op: Operation) {
        if let operation = op as? AsynchronousOperation {
            
            // Use a `BlockObserver` to add produced operations and invoke the `OperationQueueDelegate` methods.
            
            let produceHandler: BlockObserver.ProduceHandler = { [weak self] in
                self?.addOperation($1)
            }
            
            let finishHandler: BlockObserver.FinishHandler = { [weak self] in
                guard let queue = self else {
                    return
                }
                
                queue.delegate?.operationQueue(queue, operationDidFinish: $0, withErrors: $1)
            }
            
            let observer = BlockObserver(produceHandler: produceHandler, finishHandler: finishHandler)
            operation.addObserver(observer: observer)
        } else {
            
            // For regular `Foundation.Operation`s manually call out to the queue's delegate.
            
            op.addCompletionBlock { [weak self, weak op] in
                guard let queue = self, let operation = op else {
                    return
                }
                
                queue.delegate?.operationQueue(queue, operationDidFinish: operation, withErrors: [])
            }
        }
        
        delegate?.operationQueue(self, willAddOperation: op)
        super.addOperation(op)
    }

    override public func addOperations(_ ops: [Operation], waitUntilFinished wait: Bool) {
    
        // The base implementation of this method does not call `addOperation()`, so we'll call it ourselves.

        for operation in ops {
            addOperation(operation)
        }

        if wait {
            for operation in ops {
                operation.waitUntilFinished()
            }
        }
    }
}
