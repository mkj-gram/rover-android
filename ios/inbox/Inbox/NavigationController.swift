//
//  NavigationController.swift
//  Inbox
//
//  Created by Sean Rucker on 2018-05-23.
//  Copyright © 2018 Sean Rucker. All rights reserved.
//

import UIKit

class NavigationController: UINavigationController {
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        isToolbarHidden = false
    }
}
