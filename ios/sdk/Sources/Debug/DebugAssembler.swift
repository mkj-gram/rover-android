//
//  DebugAssembler.swift
//  RoverDebug
//
//  Created by Sean Rucker on 2018-06-25.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

import Foundation

public struct DebugAssembler: Assembler {
    public var isErrorTrackingEnabled: Bool
    
    public init(isErrorTrackingEnabled: Bool = true) {
        self.isErrorTrackingEnabled = isErrorTrackingEnabled
    }
    
    public func assemble(container: Container) {
        container.register(ErrorTracker.self) { resolver in
            return ErrorTrackerService(
                eventQueue: resolver.resolve(EventQueue.self)!,
                logger: resolver.resolve(Logger.self)!
            )
        }
    }
    
    public func containerDidAssemble(resolver: Resolver) {
        if isErrorTrackingEnabled {
            resolver.resolve(ErrorTracker.self)!.enable()
        }
    }
}
