//
//  LoggerService.swift
//  RoverFoundation
//
//  Created by Sean Rucker on 2018-03-08.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

import Foundation

struct LoggerService: Logger {
    let threshold: LogLevel
    
    @discardableResult func debug(_ message: String) -> String? {
        return log(message: message, level: .debug)
    }
    
    @discardableResult func warn(_ message: String) -> String? {
        return log(message: message, level: .warn)
    }
    
    @discardableResult func error(_ message: String) -> String? {
        return log(message: message, level: .error)
    }
    
    @discardableResult func warnUnlessMainThread(_ message: String) -> String? {
        if !Thread.isMainThread {
            return warn(message)
        }
        
        return nil
    }
    
    @discardableResult func warnIfMainThread(_ message: String) -> String? {
        if Thread.isMainThread {
            return warn(message)
        }
        
        return nil
    }
    
    @discardableResult func log(message: String, level: LogLevel) -> String? {
        guard level.rawValue >= threshold.rawValue else {
            return nil
        }
        
        let levelDescription = level.description.uppercased()
        let padding = String(repeating: " ", count: 10 - levelDescription.count)
        let output = "Rover     \(levelDescription)\(padding)\(message)"
        print(output)
        return output
    }
}
