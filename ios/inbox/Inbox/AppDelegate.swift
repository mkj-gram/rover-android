//
//  AppDelegate.swift
//  Inbox
//
//  Created by Sean Rucker on 2018-05-23.
//  Copyright © 2018 Sean Rucker. All rights reserved.
//

import Components
import RoverData
import RoverNotifications
import UIKit
import UserNotifications

@UIApplicationMain class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
        UNUserNotificationCenter.current().delegate = self
        application.registerForRemoteNotifications()
        configureAppearance()
        return true
    }
    
    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        if let tokenManager = Rover.shared?.resolve(TokenManager.self) {
            tokenManager.setToken(deviceToken)
        }
    }
    
    func application(_ app: UIApplication, open url: URL, options: [UIApplicationOpenURLOptionsKey : Any] = [:]) -> Bool {
        let router = Rover.shared!.resolve(Router.self)!
        return router.handle(url)
    }
    
    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([Any]?) -> Void) -> Bool {
        let router = Rover.shared!.resolve(Router.self)!
        return router.handle(userActivity)
    }
    
    func configureAppearance() {
        UINavigationBar.appearance().barTintColor = UIColor.teal
        UINavigationBar.appearance().isTranslucent = false
        UINavigationBar.appearance().tintColor = UIColor.white.withAlphaComponent(0.7)
        UINavigationBar.appearance().titleTextAttributes = [
            .foregroundColor: UIColor.white
        ]
    }
}

// MARK: UNUserNotificationCenterDelegate

extension AppDelegate: UNUserNotificationCenterDelegate {
    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
            completionHandler([.badge, .sound, .alert])
    }
    
    func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
        let notificationHandler = Rover.shared!.resolve(NotificationHandler.self)!
        notificationHandler.handle(response, completionHandler: completionHandler)
    }
}
