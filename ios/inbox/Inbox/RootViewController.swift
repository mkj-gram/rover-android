//
//  RootViewController.swift
//  Inbox
//
//  Created by Sean Rucker on 2018-05-27.
//  Copyright © 2018 Sean Rucker. All rights reserved.
//

import Auth
import RoverBluetooth
import RoverDebug
import RoverExperiences
import RoverLocation
import RoverNotifications
import UIKit

class RootViewController: UIViewController {
    override var childViewControllerForStatusBarStyle: UIViewController? {
        return childViewControllers.first
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        NotificationCenter.default.addObserver(forName: .didAuthenticate, object: nil, queue: OperationQueue.main) { _ in
            self.initializeRover()
            
            if !OnboardingViewController.isOnboardingComplete {
                self.showOnboardingViewController()
                return
            }
            
            self.showNotificationCenter()
        }
        
        NotificationCenter.default.addObserver(forName: .didInvalidate, object: nil, queue: OperationQueue.main) { _ in
            Rover.deinitialize()
            self.showSignInViewController()
        }
        
        if !Session.shared.isAuthenticated {
            showSignInViewController()
            return
        }
        
        initializeRover()
        
        if !OnboardingViewController.isOnboardingComplete {
            showOnboardingViewController()
            return
        }
        
        showNotificationCenter()
    }
    
    func showSignInViewController() {
        let viewController = SignInViewController(nibName: nil, bundle: nil)
        viewController.view.tintColor = UIColor.teal
        viewController.setLogoImage(image: #imageLiteral(resourceName: "Logo"))
        switchChild(to: viewController)
    }
    
    func showOnboardingViewController() {
        let viewController = self.storyboard!.instantiateViewController(withIdentifier: "onboarding") as! OnboardingViewController
        
        viewController.completionHandler = { [weak self] in
            self?.showNotificationCenter()
        }
        
        switchChild(to: viewController)
    }
    
    func showNotificationCenter() {
        let notificationCenter = Rover.shared!.resolve(UIViewController.self, name: "notificationCenter")!
        
        let toolBarItems: [UIBarButtonItem] = [
            UIBarButtonItem(barButtonSystemItem: .flexibleSpace, target: nil, action: nil),
            UIBarButtonItem(title: "Sign Out", style: .done, target: self, action: #selector(signOut(_:))),
            UIBarButtonItem(barButtonSystemItem: .flexibleSpace, target: nil, action: nil)
        ]
        
        notificationCenter.setToolbarItems(toolBarItems, animated: false)
        
        let navigationController = NavigationController(rootViewController: notificationCenter)
        navigationController.view.tintColor = UIColor.teal
        
        switchChild(to: navigationController)
    }
    
    @objc func signOut(_ sender: Any) {
        Session.shared.invalidate()
    }
    
    func switchChild(to nextViewController: UIViewController) {
        defer {
            setNeedsStatusBarAppearanceUpdate()
        }
        
        let firstChildViewController = childViewControllers.first
        
        nextViewController.view.frame = CGRect(x: 0, y: 0, width: view.frame.width, height: view.frame.height)
        addChildViewController(nextViewController)
        view.addSubview(nextViewController.view)
        nextViewController.didMove(toParentViewController: self)
        
        guard let previousViewController = firstChildViewController else {
            return
        }
        
        previousViewController.willMove(toParentViewController: nil)
        previousViewController.view.removeFromSuperview()
        previousViewController.removeFromParentViewController()
    }
    
    func initializeRover() {
        guard let accountToken = Session.shared.info?.sdkToken else {
            return
        }
        
        Rover.initialize(assemblers: [
            FoundationAssembler(loggerThreshold: .debug),
            DataAssembler(accountToken: accountToken),
            UIAssembler(associatedDomains: ["inbox.rover.io"], urlSchemes: ["rv-inbox"]),
            ExperiencesAssembler(),
            NotificationsAssembler(appGroup: "group.io.rover.inbox"),
            LocationAssembler(),
            BluetoothAssembler(),
            DebugAssembler()
        ])
    }
}
