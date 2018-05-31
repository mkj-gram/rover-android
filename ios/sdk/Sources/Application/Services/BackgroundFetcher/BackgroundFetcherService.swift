//
//  BackgroundFetcherService.swift
//  RoverApplication
//
//  Created by Sean Rucker on 2018-05-16.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

struct BackgroundFetcherService: BackgroundFetcher {
    let stateFetcher: StateFetcher
    
    func fetchState(fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
        stateFetcher.fetchState { result in
            switch result {
            case .failed:
                completionHandler(.failed)
            case .success:
                completionHandler(.newData)
            }
        }
    }
}
