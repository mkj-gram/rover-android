//
//  AuthorizeLocationViewController.swift
//  Inbox
//
//  Created by Sean Rucker on 2018-05-27.
//  Copyright © 2018 Sean Rucker. All rights reserved.
//

import CoreLocation
import UIKit

class AuthorizeLocationViewController: UIViewController {
    static var isLocationAuthorized: Bool {
        switch CLLocationManager.authorizationStatus() {
        case .notDetermined:
            return false
        default:
            return true
        }
    }
    
    var completionHandler: (() -> Void)?
    
    let locationManager = CLLocationManager()
    
    override func viewDidLoad() {
        locationManager.delegate = self
    }
    
    @IBAction func requestAuthorization() {
        locationManager.requestAlwaysAuthorization()
    }
}

// MARK: CLLocationManagerDelegate

extension AuthorizeLocationViewController: CLLocationManagerDelegate {
    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        if status != .notDetermined {
            self.completionHandler?()
        }
    }
}
