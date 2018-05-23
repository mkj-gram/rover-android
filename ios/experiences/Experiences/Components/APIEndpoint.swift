//
//  APIEndpoint.swift
//  Experiences
//
//  Created by Sean Rucker on 2018-05-20.
//  Copyright © 2018 Sean Rucker. All rights reserved.
//

import Foundation

struct APIEndpoint {
    static let `default` = APIEndpoint(rawValue: URL(string: "https://api.rover.io/v1/")!)
    
    var rawValue: URL
}
