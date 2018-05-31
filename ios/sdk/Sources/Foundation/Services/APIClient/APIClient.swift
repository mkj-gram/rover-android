//
//  APIClient.swift
//  RoverFoundation
//
//  Created by Sean Rucker on 2018-05-16.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

public protocol APIClient {
    func task<T>(with operation: T, completionHandler: @escaping (HTTPResult) -> Void) -> URLSessionTask where T: GraphQLOperation
}
