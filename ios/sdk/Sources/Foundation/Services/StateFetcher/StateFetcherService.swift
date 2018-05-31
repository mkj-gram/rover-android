//
//  StateFetcherService.swift
//  RoverFoundation
//
//  Created by Sean Rucker on 2018-05-21.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

class StateFetcherService: StateFetcher {
    let client: APIClient
    let logger: Logger
    
    init(client: APIClient, logger: Logger) {
        self.client = client
        self.logger = logger
    }
    
    // MARK: Fetching State
    
    func addQueryFragment(_ fragment: String) {
        fetchQuery.fragments.append(fragment)
    }
    
    struct FetchQuery: GraphQLOperation {
        static var identifier: String {
            if let UIDeviceClass = NSClassFromString("UIDevice") {
                let currentDeviceSelector = NSSelectorFromString("currentDevice")
                if let currentIMP = UIDeviceClass.method(for: currentDeviceSelector) {
                    typealias currentFunc = @convention(c) (AnyObject, Selector) -> AnyObject?
                    let curriedImplementation = unsafeBitCast(currentIMP, to: currentFunc.self)
                    if let device = curriedImplementation(UIDeviceClass.self, currentDeviceSelector) {
                        let identifierForVendorSelector = NSSelectorFromString("identifierForVendor")
                        if let identifierForVendorIMP = device.method(for: identifierForVendorSelector) {
                            typealias identifierForVendorFunc = @convention(c) (AnyObject, Selector) -> NSUUID?
                            let curriedImplementation2 = unsafeBitCast(identifierForVendorIMP, to: identifierForVendorFunc.self)
                            if let identifierForVendor = curriedImplementation2(device, identifierForVendorSelector) {
                                return identifierForVendor.uuidString
                            }
                        }
                    }
                }
            }
            return ""
        }
        
        var fragments = [String]()
        
        var query: GraphQLQuery {
            return .inline(query: """
                query {
                    device(identifier:\"\(FetchQuery.identifier)\") {
                        \(fragments.joined(separator: "\n"))
                    }
                }
                """
            )
        }
    }
    
    var fetchQuery = FetchQuery()
    
    func fetchState(completionHandler: ((FetchStateResult) -> Void)?) {
        let task = client.task(with: fetchQuery) {
            let result: FetchStateResult
            
            defer {
                completionHandler?(result)
            }
            
            switch $0 {
            case .error(let error, _):
                self.logger.error("Failed to fetch state")
                if let error = error {
                    self.logger.error(error.localizedDescription)
                }
                
                result = .failed(error: error)
            case .success(let data):
                self.observers.notify(parameters: data)
                result = .success
            }
        }
        
        task.resume()
    }
    
    // MARK: Observers
    
    var observers = ObserverSet<Data>()
    
    func addObserver(block: @escaping (Data) -> Void) -> NSObjectProtocol {
        return observers.add(block: block)
    }
    
    func removeObserver(_ token: NSObjectProtocol) {
        observers.remove(token: token)
    }
}

