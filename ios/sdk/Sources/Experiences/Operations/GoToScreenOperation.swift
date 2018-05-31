//
//  GoToScreenOperation.swift
//  RoverExperiences
//
//  Created by Sean Rucker on 2018-05-14.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

class GoToScreenOperation: RoverFoundation.Operation {
    let screenID: ID
    let viewControllerProvider: (Experience, Screen) -> UIViewController
    
    var experience: Experience?
    var navigationController: UINavigationController?
    
    init(screenID: ID, viewControllerProvider: @escaping (Experience, Screen) -> UIViewController) {
        self.screenID = screenID
        self.viewControllerProvider = viewControllerProvider
        super.init()
        name = "Go To Screen"
    }
    
    override func execute() {
        guard let experience = experience, let screen = experience.screens.first(where: { $0.id == screenID }), let navigationController = navigationController else {
            finish()
            return
        }
        
        let viewController = viewControllerProvider(experience, screen)
        
        DispatchQueue.main.async {
            navigationController.pushViewController(viewController, animated: true)
            self.finish()
        }
    }
}
