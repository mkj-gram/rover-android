//
//  HTTPTask.swift
//  RoverFoundation
//
//  Created by Sean Rucker on 2018-05-02.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

protocol HTTPTask {
    func cancel()
    func resume()
}