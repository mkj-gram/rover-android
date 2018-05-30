//
//  RootViewController.swift
//  Experiences
//
//  Created by Sean Rucker on 2018-05-20.
//  Copyright © 2018 Sean Rucker. All rights reserved.
//

import Auth

class RootViewController: SignInViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        
        view.tintColor = UIColor.dodgerBlue
        setLogoImage(image: #imageLiteral(resourceName: "Logo"))
        
        NotificationCenter.default.addObserver(forName: .didAuthenticate, object: nil, queue: OperationQueue.main) { [weak self] _ in
            self?.performSegue(withIdentifier: "signIn", sender: self)
        }
    }
    
    @IBAction func unwindToSignIn(segue: UIStoryboardSegue) { }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
       
        if Session.shared.isAuthenticated {
            performSegue(withIdentifier: "signIn", sender: self)
        }
    }
}
