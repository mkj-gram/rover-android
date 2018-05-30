//
//  OnboardingViewController.swift
//  Inbox
//
//  Created by Sean Rucker on 2018-05-27.
//  Copyright © 2018 Sean Rucker. All rights reserved.
//

import UIKit

class OnboardingViewController: UIPageViewController {
    static var isOnboardingComplete: Bool {
        return AuthorizeNotificationsViewController.isNotificationsAuthorized && AuthorizeLocationViewController.isLocationAuthorized
    }
    
    var completionHandler: (() -> Void)?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        if !AuthorizeNotificationsViewController.isNotificationsAuthorized {
            showAuthorizeNotificationsPage(animated: false)
        } else if !AuthorizeLocationViewController.isLocationAuthorized {
            showAuthorizeLocationPage(animated: false)
        } else {
            fatalError("Notifications and location are already authorized")
        }
    }
    
    func showAuthorizeNotificationsPage(animated: Bool) {
        let viewController = self.storyboard!.instantiateViewController(withIdentifier: "authorizeNotifications") as! AuthorizeNotificationsViewController
        
        viewController.completionHandler = { [weak self] in
            self?.showAuthorizeLocationPage(animated: true)
        }
        
        setViewControllers([viewController], direction: .forward, animated: animated, completion: nil)
    }
    
    func showAuthorizeLocationPage(animated: Bool) {
        let viewController = self.storyboard!.instantiateViewController(withIdentifier: "authorizeLocation") as! AuthorizeLocationViewController
        
        viewController.completionHandler = { [weak self] in
            self?.completionHandler?()
        }
        
        setViewControllers([viewController], direction: .forward, animated: animated, completion: nil)
    }
}
