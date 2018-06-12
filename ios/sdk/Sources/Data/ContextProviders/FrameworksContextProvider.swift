//
//  FrameworksContextProvider.swift
//  RoverData
//
//  Created by Sean Rucker on 2018-05-04.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

class FrameworksContextProvider: ContextProvider {
    let registry: FrameworksRegistry
    
    init(registry: FrameworksRegistry) {
        self.registry = registry
    }
    
    func captureContext(_ context: Context) -> Context {
        var nextContext = context
        nextContext.frameworks = registry.versionMap
        return nextContext
    }
}
