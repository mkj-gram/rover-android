//
//  AuthorizeNotificationsViewController.swift
//  Inbox
//
//  Created by Sean Rucker on 2018-05-27.
//  Copyright © 2018 Sean Rucker. All rights reserved.
//

import UIKit
import UserNotifications

class AuthorizeNotificationsViewController: UIViewController {
    static var isNotificationsAuthorized: Bool {
        return UserDefaults.standard.bool(forKey: "isNotificationsAuthorized")
    }
    
    var completionHandler: (() -> Void)?
    
    @IBAction func requestAuthorization() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.badge, .sound, .alert]) { [weak self] granted, error in
            DispatchQueue.main.async {
                UserDefaults.standard.set(true, forKey: "isNotificationsAuthorized")
                self?.completionHandler?()
            }
        }
    }
}
