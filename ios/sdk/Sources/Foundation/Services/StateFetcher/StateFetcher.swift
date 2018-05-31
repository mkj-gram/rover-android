//
//  StateFetcher.swift
//  RoverFoundation
//
//  Created by Sean Rucker on 2018-05-21.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

public enum FetchStateResult {
    case failed(error: Error?)
    case success
}

public protocol StateFetcher {
    func addQueryFragment(_ fragment: String)
    func addObserver(block: @escaping (Data) -> Void) -> NSObjectProtocol
    func removeObserver(_ token: NSObjectProtocol)
    func fetchState(completionHandler: ((FetchStateResult) -> Void)?)
}

extension StateFetcher {
    public func fetchState() {
        fetchState(completionHandler: nil)
    }
}
