//
//  AppDelegate.swift
//  Inbox
//
//  Created by Sean Rucker on 2018-05-23.
//  Copyright © 2018 Sean Rucker. All rights reserved.
//

import Components
import RoverData
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
        
        if let action = response.action {
            let dispatcher = Rover.shared!.resolve(Dispatcher.self)!
            dispatcher.dispatch(action)
        }
    }
}
