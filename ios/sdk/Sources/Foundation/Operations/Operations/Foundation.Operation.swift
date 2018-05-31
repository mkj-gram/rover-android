//
//  Foundation.Operation.swift
//  RoverFoundation
//
//  Created by Sean Rucker on 2018-05-10.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

extension Foundation.Operation {
    
    /*
     A simple wrapper around setting the `Foundation.Operation`'s `completionBlock`. If the `Foundation.Operation` already has a completion block, we construct a new one by chaining them together.
     */
    func addCompletionBlock(block: @escaping () -> Void) {
        guard let existing = completionBlock else {
            completionBlock = block
            return
        }
        
        completionBlock = {
            existing()
            block()
        }
    }
    
    /*
     Convenience function to add multiple dependencies at once.
     */
    func addDependencies(dependencies: [Foundation.Operation]) {
        for dependency in dependencies {
            addDependency(dependency)
        }
    }
}
