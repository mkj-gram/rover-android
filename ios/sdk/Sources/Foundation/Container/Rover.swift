//
//  Rover.swift
//  RoverFoundation
//
//  Created by Sean Rucker on 2017-03-31.
//  Copyright © 2017 Rover Labs Inc. All rights reserved.
//

public class Rover {
    static var sharedInstance: Rover?
    
    public static var shared: Resolver? {
        return sharedInstance
    }
    
    public static func initialize(assemblers: [Assembler]) {
        if let sharedInstance = sharedInstance {
            if let logger = sharedInstance.resolve(Logger.self) {
                logger.error("Rover already initialized")
            }
            return
        }
        
        let rover = Rover()
        
        assemblers.forEach { $0.assemble(container: rover) }
        assemblers.forEach { $0.containerDidAssemble(resolver: rover) }
        
        if let logger = rover.resolve(Logger.self) {
            logger.warnUnlessMainThread("Rover must be initialized on the main thread")
        }
        
        sharedInstance = rover
    }
    
    public static func deinitialize() {
        sharedInstance = nil
    }
    
    var services = [ServiceKey: ServiceEntryProtocol]()
}

// MARK: Container

extension Rover: Container {
    public func register<Service>(_ serviceType: Service.Type, factory: @escaping (Resolver) -> Service) {
        register(serviceType, name: nil, scope: .singleton, factory: factory)
    }
    
    public func register<Service>(_ serviceType: Service.Type, name: String?, factory: @escaping (Resolver) -> Service) {
        register(serviceType, name: name, scope: .singleton, factory: factory)
    }
    
    public func register<Service>(_ serviceType: Service.Type, scope: ServiceScope, factory: @escaping (Resolver) -> Service) {
        register(serviceType, name: nil, scope: scope, factory: factory)
    }
    
    public func register<Service>(_ serviceType: Service.Type, name: String?, scope: ServiceScope, factory: @escaping (Resolver) -> Service) {
        _register(serviceType, name: name, scope: scope, factory: factory)
    }
    
    public func register<Service, Arg1>(_ serviceType: Service.Type, factory: @escaping (Resolver, Arg1) -> Service) {
        register(serviceType, name: nil, scope: .singleton, factory: factory)
    }
    
    public func register<Service, Arg1>(_ serviceType: Service.Type, name: String?, factory: @escaping (Resolver, Arg1) -> Service) {
        register(serviceType, name: name, scope: .singleton, factory: factory)
    }
    
    public func register<Service, Arg1>(_ serviceType: Service.Type, scope: ServiceScope, factory: @escaping (Resolver, Arg1) -> Service) {
        register(serviceType, name: nil, scope: scope, factory: factory)
    }
    
    public func register<Service, Arg1>(_ serviceType: Service.Type, name: String?, scope: ServiceScope, factory: @escaping (Resolver, Arg1) -> Service) {
        _register(serviceType, name: name, scope: scope, factory: factory)
    }
    
    public func register<Service, Arg1, Arg2>(_ serviceType: Service.Type, factory: @escaping (Resolver, Arg1, Arg2) -> Service) {
        register(serviceType, name: nil, scope: .singleton, factory: factory)
    }
    
    public func register<Service, Arg1, Arg2>(_ serviceType: Service.Type, name: String?, factory: @escaping (Resolver, Arg1, Arg2) -> Service) {
        register(serviceType, name: name, scope: .singleton, factory: factory)
    }
    
    public func register<Service, Arg1, Arg2>(_ serviceType: Service.Type, scope: ServiceScope, factory: @escaping (Resolver, Arg1, Arg2) -> Service) {
        register(serviceType, name: nil, scope: scope, factory: factory)
    }
    
    public func register<Service, Arg1, Arg2>(_ serviceType: Service.Type, name: String?, scope: ServiceScope, factory: @escaping (Resolver, Arg1, Arg2) -> Service) {
        _register(serviceType, name: name, scope: scope, factory: factory)
    }
    
    public func register<Service, Arg1, Arg2, Arg3>(_ serviceType: Service.Type, factory: @escaping (Resolver, Arg1, Arg2, Arg3) -> Service) {
        register(serviceType, name: nil, scope: .singleton, factory: factory)
    }
    
    public func register<Service, Arg1, Arg2, Arg3>(_ serviceType: Service.Type, name: String?, factory: @escaping (Resolver, Arg1, Arg2, Arg3) -> Service) {
        register(serviceType, name: name, scope: .singleton, factory: factory)
    }
    
    public func register<Service, Arg1, Arg2, Arg3>(_ serviceType: Service.Type, scope: ServiceScope, factory: @escaping (Resolver, Arg1, Arg2, Arg3) -> Service) {
        register(serviceType, name: nil, scope: scope, factory: factory)
    }
    
    public func register<Service, Arg1, Arg2, Arg3>(_ serviceType: Service.Type, name: String?, scope: ServiceScope, factory: @escaping (Resolver, Arg1, Arg2, Arg3) -> Service) {
        _register(serviceType, name: name, scope: scope, factory: factory)
    }
    
    public func register<Service, Arg1, Arg2, Arg3, Arg4>(_ serviceType: Service.Type, factory: @escaping (Resolver, Arg1, Arg2, Arg3, Arg4) -> Service) {
        register(serviceType, name: nil, scope: .singleton, factory: factory)
    }
    
    public func register<Service, Arg1, Arg2, Arg3, Arg4>(_ serviceType: Service.Type, name: String?, factory: @escaping (Resolver, Arg1, Arg2, Arg3, Arg4) -> Service) {
        register(serviceType, name: name, scope: .singleton, factory: factory)
    }
    
    public func register<Service, Arg1, Arg2, Arg3, Arg4>(_ serviceType: Service.Type, scope: ServiceScope, factory: @escaping (Resolver, Arg1, Arg2, Arg3, Arg4) -> Service) {
        register(serviceType, name: nil, scope: scope, factory: factory)
    }
    
    public func register<Service, Arg1, Arg2, Arg3, Arg4>(_ serviceType: Service.Type, name: String?, scope: ServiceScope, factory: @escaping (Resolver, Arg1, Arg2, Arg3, Arg4) -> Service) {
        _register(serviceType, name: name, scope: scope, factory: factory)
    }
    
    func _register<Service, Factory>(_ serviceType: Service.Type, name: String?, scope: ServiceScope, factory: Factory) {
        let factoryType = type(of: factory)
        let key = ServiceKey(factoryType: factoryType, name: name)
        let entry = ServiceEntry(serviceType: serviceType, scope: scope, factory: factory)
        services[key] = entry
    }
}

// MARK: Resolver

extension Rover: Resolver {
    public func resolve<Service>(_ serviceType: Service.Type) -> Service? {
        return resolve(serviceType, name: nil)
    }
    
    public func resolve<Service, Arg1>(_ serviceType: Service.Type, arguments arg1: Arg1) -> Service? {
        return resolve(serviceType, name: nil, arguments: arg1)
    }
    
    public func resolve<Service, Arg1, Arg2>(_ serviceType: Service.Type, arguments arg1: Arg1, _ arg2: Arg2) -> Service? {
        return resolve(serviceType, name: nil, arguments: arg1, arg2)
    }
    
    public func resolve<Service, Arg1, Arg2, Arg3>(_ serviceType: Service.Type, arguments arg1: Arg1, _ arg2: Arg2, _ arg3: Arg3) -> Service? {
        return resolve(serviceType, name: nil, arguments: arg1, arg2, arg3)
    }
    
    public func resolve<Service, Arg1, Arg2, Arg3, Arg4>(_ serviceType: Service.Type, arguments arg1: Arg1, _ arg2: Arg2, _ arg3: Arg3, _ arg4: Arg4) -> Service? {
        return resolve(serviceType, name: nil, arguments: arg1, arg2, arg3, arg4)
    }
    
    public func resolve<Service>(_ serviceType: Service.Type, name: String?) -> Service? {
        typealias Factory = (Resolver) -> Service
        return _resolve(name: name) { (factory: Factory) -> Service in factory(self) }
    }
    
    public func resolve<Service, Arg1>(_ serviceType: Service.Type, name: String?, arguments arg1: Arg1) -> Service? {
        typealias Factory = (Resolver, Arg1) -> Service
        return _resolve(name: name) { (factory: Factory) -> Service in factory(self, arg1) }
    }
    
    public func resolve<Service, Arg1, Arg2>(_ serviceType: Service.Type, name: String?, arguments arg1: Arg1, _ arg2: Arg2) -> Service? {
        typealias Factory = (Resolver, Arg1, Arg2) -> Service
        return _resolve(name: name) { (factory: Factory) -> Service in factory(self, arg1, arg2) }
    }
    
    public func resolve<Service, Arg1, Arg2, Arg3>(_ serviceType: Service.Type, name: String?, arguments arg1: Arg1, _ arg2: Arg2, _ arg3: Arg3) -> Service? {
        typealias Factory = (Resolver, Arg1, Arg2, Arg3) -> Service
        return _resolve(name: name) { (factory: Factory) -> Service in factory(self, arg1, arg2, arg3) }
    }
    
    public func resolve<Service, Arg1, Arg2, Arg3, Arg4>(_ serviceType: Service.Type, name: String?, arguments arg1: Arg1, _ arg2: Arg2, _ arg3: Arg3, _ arg4: Arg4) -> Service? {
        typealias Factory = (Resolver, Arg1, Arg2, Arg3, Arg4) -> Service
        return _resolve(name: name) { (factory: Factory) -> Service in factory(self, arg1, arg2, arg3, arg4) }
    }
    
    func _resolve<Service, Factory>(name: String?, invoker: (Factory) -> Service) -> Service? {
        let key = ServiceKey(factoryType: Factory.self, name: name)
        
        guard let entry = services[key] as? ServiceEntry<Service>, let factory = entry.factory as? Factory else {
            return nil
        }
        
        if entry.scope == .transient {
            return invoker(factory)
        }
        
        if let persistedInstance = entry.instance {
            return persistedInstance
        }
        
        let resolvedInstance = invoker(factory)
        
        var nextEntry = entry
        nextEntry.instance = resolvedInstance
        services[key] = nextEntry
        
        return resolvedInstance
    }
}
