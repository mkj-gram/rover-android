//
//  BackgroundFetcher.swift
//  RoverApplication
//
//  Created by Sean Rucker on 2018-05-16.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

public protocol BackgroundFetcher {
    func fetchState(fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void)
}
