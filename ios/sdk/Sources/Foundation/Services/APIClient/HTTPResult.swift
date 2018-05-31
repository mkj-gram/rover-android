//
//  HTTPResult.swift
//  RoverFoundation
//
//  Created by Sean Rucker on 2018-05-02.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

public enum HTTPResult {
    case error(error: Error?, isRetryable: Bool)
    case success(data: Data)
}
