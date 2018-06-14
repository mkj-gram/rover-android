//
//  Dispatcher.swift
//  RoverFoundation
//
//  Created by Sean Rucker on 2018-05-10.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

import Foundation

public protocol Dispatcher {
    @discardableResult func dispatch(_ action: Action) -> Operation?
}
