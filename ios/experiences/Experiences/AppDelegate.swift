//
//  AppDelegate.swift
//  Experiences
//
//  Created by Sean Rucker on 2018-05-19.
//  Copyright © 2018 Sean Rucker. All rights reserved.
//

import UIKit

@UIApplicationMain class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey : Any]? = nil) -> Bool {
        configureAppearance()
        return true
    }
        
    func configureAppearance() {
        UINavigationBar.appearance().barTintColor = UIColor.dodgerBlue
        UINavigationBar.appearance().isTranslucent = false
        UINavigationBar.appearance().tintColor = UIColor.white.withAlphaComponent(0.7)
        UINavigationBar.appearance().titleTextAttributes = [
            .foregroundColor: UIColor.white
        ]
        
        UISegmentedControl.appearance().tintColor = UIColor.dodgerBlue
        UISegmentedControl.appearance().setTitleTextAttributes([
            NSAttributedStringKey.font: UIFont.systemFont(ofSize: 14)
        ], for: .normal)
        UISegmentedControl.appearance().setTitleTextAttributes([
            NSAttributedStringKey.font: UIFont.systemFont(ofSize: 14)
        ], for: UIControlState.selected)
    }
}
