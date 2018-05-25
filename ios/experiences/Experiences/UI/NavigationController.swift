//
//  NavigationController.swift
//  Experiences
//
//  Created by Sean Rucker on 2018-05-20.
//  Copyright © 2018 Sean Rucker. All rights reserved.
//

import RoverExperiences

class NavigationController: UINavigationController {
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        NotificationCenter.default.addObserver(forName: .didInvalidate, object: nil, queue: OperationQueue.main) { [weak self] _ in
            Rover.deinitialize()
            self?.performSegue(withIdentifier: "signOut", sender: self)
        }
        
        setToolbarHidden(false, animated: false)
        
        let accountToken = Session.shared.info!.sdkToken
        Rover.initialize(assemblers: [
            FoundationAssembler(accountToken: accountToken),
            UIAssembler(),
            ExperiencesAssembler()
        ])
    }
}