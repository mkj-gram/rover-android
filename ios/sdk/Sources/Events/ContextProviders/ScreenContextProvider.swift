//
//  ScreenContextProvider.swift
//  RoverEvents
//
//  Created by Sean Rucker on 2017-08-14.
//  Copyright © 2017 Rover Labs Inc. All rights reserved.
//

class ScreenContextProvider: ContextProvider {
    let screen: UIScreen
    
    lazy var screenHeight: Int = {
        return Int(screen.bounds.height)
    }()
    
    lazy var screenWidth: Int = {
        return Int(screen.bounds.width)
    }()
    
    init(screen: UIScreen) {
        self.screen = screen
    }

    func captureContext(_ context: Context) -> Context {
        var nextContext = context
        nextContext.screenHeight = screenHeight
        nextContext.screenWidth = screenWidth
        return nextContext
    }
}
