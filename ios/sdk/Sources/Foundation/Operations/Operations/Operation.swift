//
//  Operation.swift
//  RoverFoundation
//
//  Created by Sean Rucker on 2018-05-10.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

import Foundation

extension Operation {
    
    /*
     A simple wrapper around setting the `Operation`'s `completionBlock`. If the `Operation` already has a completion block, we construct a new one by chaining them together.
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
    func addDependencies(dependencies: [Operation]) {
        for dependency in dependencies {
            addDependency(dependency)
        }
    }
}
