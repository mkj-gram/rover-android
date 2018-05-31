//
//  OperationObserver.swift
//  RoverFoundation
//
//  Created by Sean Rucker on 2018-05-10.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

public protocol OperationObserver {
    func operationDidStart(_ operation: Operation)
    func operation(_ operation: Operation, didProduceOperation newOperation: Foundation.Operation)
    func operationDidFinish(_ operation: Operation, errors: [Error])
}
