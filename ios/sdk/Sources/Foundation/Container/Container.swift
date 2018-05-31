//
//  Container.swift
//  RoverFoundation
//
//  Created by Sean Rucker on 2017-09-19.
//  Copyright © 2017 Rover Labs Inc. All rights reserved.
//

public protocol Container {
    func register<Service>(_ serviceType: Service.Type, factory: @escaping (Resolver) -> Service)
    func register<Service>(_ serviceType: Service.Type, name: String?, factory: @escaping (Resolver) -> Service)
    func register<Service>(_ serviceType: Service.Type, scope: ServiceScope, factory: @escaping (Resolver) -> Service)
    func register<Service>(_ serviceType: Service.Type, name: String?, scope: ServiceScope, factory: @escaping (Resolver) -> Service)
    
    func register<Service, Arg1>(_ serviceType: Service.Type, factory: @escaping (Resolver, Arg1) -> Service)
    func register<Service, Arg1>(_ serviceType: Service.Type, name: String?, factory: @escaping (Resolver, Arg1) -> Service)
    func register<Service, Arg1>(_ serviceType: Service.Type, scope: ServiceScope, factory: @escaping (Resolver, Arg1) -> Service)
    func register<Service, Arg1>(_ serviceType: Service.Type, name: String?, scope: ServiceScope, factory: @escaping (Resolver, Arg1) -> Service)
    
    func register<Service, Arg1, Arg2>(_ serviceType: Service.Type, factory: @escaping (Resolver, Arg1, Arg2) -> Service)
    func register<Service, Arg1, Arg2>(_ serviceType: Service.Type, name: String?, factory: @escaping (Resolver, Arg1, Arg2) -> Service)
    func register<Service, Arg1, Arg2>(_ serviceType: Service.Type, scope: ServiceScope, factory: @escaping (Resolver, Arg1, Arg2) -> Service)
    func register<Service, Arg1, Arg2>(_ serviceType: Service.Type, name: String?, scope: ServiceScope, factory: @escaping (Resolver, Arg1, Arg2) -> Service)
    
    func register<Service, Arg1, Arg2, Arg3>(_ serviceType: Service.Type, factory: @escaping (Resolver, Arg1, Arg2, Arg3) -> Service)
    func register<Service, Arg1, Arg2, Arg3>(_ serviceType: Service.Type, name: String?, factory: @escaping (Resolver, Arg1, Arg2, Arg3) -> Service)
    func register<Service, Arg1, Arg2, Arg3>(_ serviceType: Service.Type, scope: ServiceScope, factory: @escaping (Resolver, Arg1, Arg2, Arg3) -> Service)
    func register<Service, Arg1, Arg2, Arg3>(_ serviceType: Service.Type, name: String?, scope: ServiceScope, factory: @escaping (Resolver, Arg1, Arg2, Arg3) -> Service)
    
    func register<Service, Arg1, Arg2, Arg3, Arg4>(_ serviceType: Service.Type, factory: @escaping (Resolver, Arg1, Arg2, Arg3, Arg4) -> Service)
    func register<Service, Arg1, Arg2, Arg3, Arg4>(_ serviceType: Service.Type, name: String?, factory: @escaping (Resolver, Arg1, Arg2, Arg3, Arg4) -> Service)
    func register<Service, Arg1, Arg2, Arg3, Arg4>(_ serviceType: Service.Type, scope: ServiceScope, factory: @escaping (Resolver, Arg1, Arg2, Arg3, Arg4) -> Service)
    func register<Service, Arg1, Arg2, Arg3, Arg4>(_ serviceType: Service.Type, name: String?, scope: ServiceScope, factory: @escaping (Resolver, Arg1, Arg2, Arg3, Arg4) -> Service)
}
