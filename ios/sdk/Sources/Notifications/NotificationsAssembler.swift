//
//  NotificationsAssembler.swift
//  RoverNotifications
//
//  Created by Sean Rucker on 2018-03-07.
//  Copyright © 2018 Sean Rucker. All rights reserved.
//

import UIKit
import UserNotifications

public struct NotificationsAssembler: Assembler {
    public var appGroup: String
    public var influenceTime: Int
    public var isInfluenceTrackingEnabled: Bool
    public var maxNotifications: Int
    public var storeSize:Int
    
    public init(appGroup: String, isInfluenceTrackingEnabled: Bool = true, influenceTime: Int = 120, maxNotifications: Int = 200, storeSize: Int = 150) {
        self.appGroup = appGroup
        self.influenceTime = influenceTime
        self.isInfluenceTrackingEnabled = isInfluenceTrackingEnabled
        self.maxNotifications = maxNotifications
        self.storeSize = storeSize
    }
    
    public func assemble(container: Container) {
        
        // MARK: ContextProvider (notificationAuthorization)
        
        container.register(ContextProvider.self, name: "notificationAuthorization") { resolver in
            return NotificationAuthorizationContextProvider(userNotificationCenter: UNUserNotificationCenter.current())
        }
        
        // MARK: InfluenceTracker
        
        container.register(InfluenceTracker.self) { resolver in
            let eventQueue = resolver.resolve(EventQueue.self)
            let logger = resolver.resolve(Logger.self)!
            let userDefaults = UserDefaults(suiteName: self.appGroup)!
            return InfluenceTrackerService(influenceTime: self.influenceTime, eventQueue: eventQueue, logger: logger, notificationCenter: NotificationCenter.default, userDefaults: userDefaults)
        }
        
        // MARK: NotificationStore
        
        container.register(NotificationStore.self) { [maxNotifications] resolver in
            let client = resolver.resolve(GraphQLClient.self)!
            let eventQueue = resolver.resolve(EventQueue.self)
            let logger = resolver.resolve(Logger.self)!
            let stateFetcher = resolver.resolve(StateFetcher.self)!
            return NotificationStoreService(maxSize: maxNotifications, client: client, eventQueue: eventQueue, logger: logger, stateFetcher: stateFetcher)
        }
        
        // MARK: Operation (addNotification)
        
        container.register(Operation.self, name: "addNotification", scope: .transient) { (resolver, notification: Notification) in
            let dispatcher = resolver.resolve(Dispatcher.self)!
            let eventQueue = resolver.resolve(EventQueue.self)!
            let notificationCenter = resolver.resolve(UIViewController.self, name: "notificationCenter")!
            let notificationStore = resolver.resolve(NotificationStore.self)!
            return AddNotificationOperation(dispatcher: dispatcher, eventQueue: eventQueue, notification: notification, notificationCenter: notificationCenter, notificationStore: notificationStore)
        }
        
        // MARK: Operation (presentNotificationCenter)
        
        container.register(Operation.self, name: "presentNotificationCenter", scope: .transient) { resolver in
            let viewControllerToPresent = resolver.resolve(UIViewController.self, name: "notificationCenter")!
            let logger = resolver.resolve(Logger.self)!
            return PresentViewOperation(viewControllerToPresent: viewControllerToPresent, animated: true, logger: logger)
        }
        
        // MARK: UIViewController (notificationCenter)
        
        container.register(UIViewController.self, name: "notificationCenter") { resolver in
            let dispatcher = resolver.resolve(Dispatcher.self)!
            let eventQueue = resolver.resolve(EventQueue.self)
            let imageStore = resolver.resolve(ImageStore.self)!
            let notificationStore = resolver.resolve(NotificationStore.self)!
            let sessionController = resolver.resolve(SessionController.self)!
            return NotificationCenterViewController(dispatcher: dispatcher, eventQueue: eventQueue, imageStore: imageStore, notificationStore: notificationStore, sessionController: sessionController)
        }
    }
    
    public func containerDidAssemble(resolver: Resolver) {
        if isInfluenceTrackingEnabled {
            let influenceTracker = resolver.resolve(InfluenceTracker.self)!
            influenceTracker.startMonitoring()
        }
        
        let store = resolver.resolve(NotificationStore.self)!
        store.restore()
    }
}
