//
//  BluetoothAssembler.swift
//  RoverBluetooth
//
//  Created by Sean Rucker on 2018-03-21.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

public struct BluetoothAssembler: Assembler {
    public init() { }
    
    public func assemble(container: Container) {
        container.register(BluetoothManager.self) { resolver in
            let central = CBCentralManager()
            let eventQueue = resolver.resolve(EventQueue.self)!
            let logger = resolver.resolve(Logger.self)!
            return BluetoothManagerService(central: central, eventQueue: eventQueue, logger: logger, userDefaults: UserDefaults.standard)
        }
        
        container.register(ContextProvider.self, name: "bluetooth") { resolver in
            let bluetoothManager = resolver.resolve(BluetoothManager.self)!
            return BluetoothContextProvider(bluetoothManager: bluetoothManager)
        }
    }
    
    public func containerDidAssemble(resolver: Resolver) {
        let frameworksRegistry = resolver.resolve(FrameworksRegistry.self)!
        frameworksRegistry.register("io.rover.RoverBluetooth")
        
        let bluetoothManager = resolver.resolve(BluetoothManager.self)!
        bluetoothManager.restore()
    }
}
