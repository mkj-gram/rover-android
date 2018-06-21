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
        
        // MARK: Action (openNotification)
        
        container.register(Action.self, name: "openNotification", scope: .transient) { (resolver, notification: Notification) in
            let eventQueue = resolver.resolve(EventQueue.self)!
            let notificationStore = resolver.resolve(NotificationStore.self)!
            return OpenNotificationAction(eventQueue: eventQueue, notification: notification, notificationStore: notificationStore, presentWebsiteActionProvider: { url in
                return resolver.resolve(Action.self, name: "presentWebsite", arguments: url)!
            })
        }
        
        // MARK: Action (presentNotificationCenter)
        
        container.register(Action.self, name: "presentNotificationCenter", scope: .transient) { resolver in
            let viewControllerToPresent = resolver.resolve(UIViewController.self, name: "notificationCenter")!
            return resolver.resolve(Action.self, name: "presentView", arguments: viewControllerToPresent)!
        }
        
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
        
        // MARK: NotificationHandler
        
        container.register(NotificationHandler.self) { resolver in
            let dispatcher = resolver.resolve(Dispatcher.self)!
            return NotificationHandlerService(dispatcher: dispatcher, actionProvider: { notification in
                return resolver.resolve(Action.self, name: "openNotification", arguments: notification)!
            })
        }
        
        // MARK: NotificationStore
        
        container.register(NotificationStore.self) { [maxNotifications] resolver in
            let client = resolver.resolve(GraphQLClient.self)!
            let eventQueue = resolver.resolve(EventQueue.self)
            let logger = resolver.resolve(Logger.self)!
            let stateFetcher = resolver.resolve(StateFetcher.self)!
            return NotificationStoreService(maxSize: maxNotifications, client: client, eventQueue: eventQueue, logger: logger, stateFetcher: stateFetcher)
        }
        
        // MARK: RouteHandler (notificationCenter)
        
        container.register(RouteHandler.self, name: "notificationCenter") { resolver in
            return NotificationCenterRouteHandler(actionProvider: {
                return resolver.resolve(Action.self, name: "presentNotificationCenter")!
            })
        }
        
        // MARK: UIViewController (notificationCenter)
        
        container.register(UIViewController.self, name: "notificationCenter") { resolver in
            let dispatcher = resolver.resolve(Dispatcher.self)!
            let eventQueue = resolver.resolve(EventQueue.self)!
            let imageStore = resolver.resolve(ImageStore.self)!
            let notificationStore = resolver.resolve(NotificationStore.self)!
            let router = resolver.resolve(Router.self)!
            let sessionController = resolver.resolve(SessionController.self)!
            return NotificationCenterViewController(dispatcher: dispatcher, eventQueue: eventQueue, imageStore: imageStore, notificationStore: notificationStore, router: router, sessionController: sessionController, presentWebsiteActionProvider: { url in
                return resolver.resolve(Action.self, name: "presentWebsite", arguments: url)!
            })
        }
    }
    
    public func containerDidAssemble(resolver: Resolver) {
        if isInfluenceTrackingEnabled {
            let influenceTracker = resolver.resolve(InfluenceTracker.self)!
            influenceTracker.startMonitoring()
        }
        
        if let router = resolver.resolve(Router.self) {
            let handler = resolver.resolve(RouteHandler.self, name: "notificationCenter")!
            router.addHandler(handler)
        }
        
        let store = resolver.resolve(NotificationStore.self)!
        store.restore()
    }
}
