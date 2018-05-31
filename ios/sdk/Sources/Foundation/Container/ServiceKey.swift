//
//  ServiceKey.swift
//  RoverFoundation
//
//  Created by Sean Rucker on 2017-09-20.
//  Copyright © 2017 Rover Labs Inc. All rights reserved.
//

struct ServiceKey: Hashable, Equatable {
    var factoryType: ServiceFactory.Type
    var name: String?
    
    var hashValue: Int {
        return ObjectIdentifier(factoryType).hashValue ^ (name?.hashValue ?? 0)
    }
    
    static func == (lhs: ServiceKey, rhs: ServiceKey) -> Bool {
        return lhs.factoryType == rhs.factoryType && lhs.name == rhs.name
    }
}
