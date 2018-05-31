//
//  Logger.swift
//  RoverFoundation
//
//  Created by Sean Rucker on 2017-08-11.
//  Copyright © 2017 Rover Labs Inc. All rights reserved.
//

public protocol Logger {
    @discardableResult func debug(_ message: String) -> String?
    @discardableResult func warn(_ message: String) -> String?
    @discardableResult func error(_ message: String) -> String?
    @discardableResult func warnUnlessMainThread(_ message: String) -> String?
    @discardableResult func warnIfMainThread(_ message: String) -> String?
}
