//
//  IdentityAssembler.swift
//  RoverIdentity
//
//  Created by Sean Rucker on 2018-05-22.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

public struct IdentityAssembler: Assembler {
    public func assemble(container: Container) {
        
        // MARK: ContextProvider (deviceAttributes)
        
        container.register(ContextProvider.self, name: "deviceAttributes") { resolver in
            let deviceAttributes = resolver.resolve(DeviceAttributes.self)!
            return DeviceAttributesContextProvider(deviceAttributes: deviceAttributes)
        }
        
        // MARK: DeviceAttributes
        
        container.register(DeviceAttributes.self) { resolver in
            let eventQueue = resolver.resolve(EventQueue.self)!
            let logger = resolver.resolve(Logger.self)!
            return DeviceAttributesService(eventQueue: eventQueue, logger: logger, userDefaults: UserDefaults.standard)
        }
    }
    
    public func containerDidAssemble(resolver: Resolver) {
        let deviceAttributes = resolver.resolve(DeviceAttributes.self)!
        deviceAttributes.restore()
        
        if let eventQueue = resolver.resolve(EventQueue.self) {
            let contextProvider = resolver.resolve(ContextProvider.self, name: "deviceAttributes")!
            eventQueue.addContextProviders(contextProvider)
        }
        
        if let frameworksRegistry = resolver.resolve(FrameworksRegistry.self) {
            frameworksRegistry.register("io.rover.RoverUI")
        }
    }
}
