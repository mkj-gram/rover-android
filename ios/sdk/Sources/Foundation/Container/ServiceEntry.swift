//
//  ServiceEntry.swift
//  RoverFoundation
//
//  Created by Sean Rucker on 2017-09-20.
//  Copyright © 2017 Rover Labs Inc. All rights reserved.
//

struct ServiceEntry<T> {
    let serviceType: T.Type
    let factory: ServiceFactory
    let scope: ServiceScope
    
    var instance: T?
    
    init(serviceType: T.Type, scope: ServiceScope, factory: ServiceFactory) {
        self.serviceType = serviceType
        self.factory = factory
        self.scope = scope
    }
}

extension ServiceEntry: ServiceEntryProtocol { }
