//
//  Resolver.swift
//  RoverFoundation
//
//  Created by Sean Rucker on 2017-09-15.
//  Copyright © 2017 Rover Labs Inc. All rights reserved.
//

public protocol Resolver {
    func resolve<Service>(_ serviceType: Service.Type, name: String?) -> Service?
    func resolve<Service, Arg1>(_ serviceType: Service.Type, name: String?, arguments arg1: Arg1) -> Service?
    func resolve<Service, Arg1, Arg2>(_ serviceType: Service.Type, name: String?, arguments arg1: Arg1, _ arg2: Arg2) -> Service?
    func resolve<Service, Arg1, Arg2, Arg3>(_ serviceType: Service.Type, name: String?, arguments arg1: Arg1, _ arg2: Arg2, _ arg3: Arg3) -> Service?
    func resolve<Service, Arg1, Arg2, Arg3, Arg4>(_ serviceType: Service.Type, name: String?, arguments arg1: Arg1, _ arg2: Arg2, _ arg3: Arg3, _ arg4: Arg4) -> Service?
    
    func resolve<Service>(_ serviceType: Service.Type) -> Service?
    func resolve<Service, Arg1>(_ serviceType: Service.Type, arguments arg1: Arg1) -> Service?
    func resolve<Service, Arg1, Arg2>(_ serviceType: Service.Type, arguments arg1: Arg1, _ arg2: Arg2) -> Service?
    func resolve<Service, Arg1, Arg2, Arg3>(_ serviceType: Service.Type, arguments arg1: Arg1, _ arg2: Arg2, _ arg3: Arg3) -> Service?
    func resolve<Service, Arg1, Arg2, Arg3, Arg4>(_ serviceType: Service.Type, arguments arg1: Arg1, _ arg2: Arg2, _ arg3: Arg3, _ arg4: Arg4) -> Service?
}
