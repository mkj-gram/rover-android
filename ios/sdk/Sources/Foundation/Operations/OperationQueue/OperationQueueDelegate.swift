//
//  OperationQueueDelegate.swift
//  RoverFoundation
//
//  Created by Sean Rucker on 2018-05-10.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

protocol OperationQueueDelegate: class {
    func operationQueue(_ operationQueue: OperationQueue, willAddOperation operation: Foundation.Operation)
    func operationQueue(_ operationQueue: OperationQueue, operationDidFinish operation: Foundation.Operation, withErrors errors: [Error])
}
