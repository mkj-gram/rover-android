//
//  Operation.swift
//  RoverFoundation
//
//  Created by Sean Rucker on 2018-04-24.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

/*
 The subclass of `Foundation.Operation` from which all other operations should be derived. This class implements the requirements for asynchronous operations and adds Observers, which allows the operation to notify interested parties about operation state changes.
 */
open class Operation: Foundation.Operation {
    override open var isAsynchronous: Bool {
        return true
    }
    
    private var _isExecuting = false {
        willSet {
            willChangeValue(for: \.isExecuting)
        }
        didSet {
            didChangeValue(for: \.isExecuting)
        }
    }
    
    override open var isExecuting: Bool {
        return _isExecuting
    }
    
    private var _isFinished = false {
        willSet {
            willChangeValue(for: \.isFinished)
        }
        
        didSet {
            didChangeValue(for: \.isFinished)
        }
    }
    
    override open var isFinished: Bool {
        return _isFinished
    }
    
    // MARK: Execution
    
    override open func start() {
        super.start()
        
        if isCancelled {
            finish()
        }
    }
    
    override open func main() {
        if isCancelled {
            finish()
            return
        }
        
        _isExecuting = true
        
        for observer in observers {
            observer.operationDidStart(self)
        }
        
        execute()
    }
    
    open func execute() {
        finish()
    }
    
    final public func produceOperation(_ operation: Operation) {
        for observer in observers {
            observer.operation(self, didProduceOperation: operation)
        }
    }
    
    // MARK: Finishing
    
    final public func finish(error: Error?) {
        if let error = error {
            finish(errors: [error])
        } else {
            finish()
        }
    }
    
    final public func finish(errors: [Error] = []) {
        for observer in observers {
            observer.operationDidFinish(self, errors: errors)
        }
        
        _isExecuting = false
        _isFinished = true
    }
    
    // MARK: Observers
    
    public private(set) var observers = [OperationObserver]()
    
    public func addObserver(observer: OperationObserver) {
        guard !isExecuting else {
            return
        }
        
        observers.append(observer)
    }
}
