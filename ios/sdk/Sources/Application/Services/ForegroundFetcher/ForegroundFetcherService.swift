//
//  ForegroundFetcherService.swift
//  RoverApplication
//
//  Created by Sean Rucker on 2018-05-22.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

class ForegroundFetcherService: ForegroundFetcher {
    let stateFetcher: StateFetcher
    
    var didFinishLaunchingObserver: NSObjectProtocol?
    var willEnterForegroundObserver: NSObjectProtocol?
    
    init(stateFetcher: StateFetcher) {
        self.stateFetcher = stateFetcher
    }
    
    func startMonitoring() {
        stopMonitoring()
        
        didFinishLaunchingObserver = NotificationCenter.default.addObserver(forName: .UIApplicationDidFinishLaunching, object: nil, queue: nil) { [weak self] _ in
            self?.stateFetcher.fetchState()
        }
        
        willEnterForegroundObserver = NotificationCenter.default.addObserver(forName: .UIApplicationWillEnterForeground, object: nil, queue: nil) { [weak self] _ in
            self?.stateFetcher.fetchState()
        }
    }
    
    func stopMonitoring() {
        [didFinishLaunchingObserver, willEnterForegroundObserver].compactMap({ $0 }).forEach(NotificationCenter.default.removeObserver)
    }
}
