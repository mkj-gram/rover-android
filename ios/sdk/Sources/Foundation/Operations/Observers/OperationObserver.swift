//
//  OperationObserver.swift
//  RoverFoundation
//
//  Created by Sean Rucker on 2018-05-10.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

import Foundation

public protocol OperationObserver {
    func operationDidStart(_ operation: AsynchronousOperation)
    func operation(_ operation: AsynchronousOperation, didProduceOperation newOperation: Operation)
    func operationDidFinish(_ operation: AsynchronousOperation, errors: [Error])
}
