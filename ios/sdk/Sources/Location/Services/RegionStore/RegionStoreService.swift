//
//  RegionStore.swift
//  RoverLocation
//
//  Created by Sean Rucker on 2018-03-07.
//  Copyright © 2018 Sean Rucker. All rights reserved.
//

class RegionStoreService: RegionStore {
    let client: APIClient
    let logger: Logger
    
    var regions = Set<Region>() {
        didSet {
            observers.notify(parameters: regions)
        }
    }

    var observers = ObserverSet<Set<Region>>()
    var stateObservation: NSObjectProtocol?
    
    init(client: APIClient, logger: Logger, stateFetcher: StateFetcher) {
        self.client = client
        self.logger = logger
        
        stateFetcher.addQueryFragment(RegionStoreService.queryFragment)
        
        stateObservation = stateFetcher.addObserver { data in
            let decoder = JSONDecoder()
            decoder.dateDecodingStrategy = .formatted(DateFormatter.rfc3339)
            if let response = try? decoder.decode(FetchResponse.self, from: data) {
                self.regions = response.data.device.regions
            }
        }
    }
    
    // MARK: Observers
    
    func addObserver(block: @escaping (Set<Region>) -> Void) -> NSObjectProtocol {
        return observers.add(block: block)
    }
    
    func removeObserver(_ token: NSObjectProtocol) {
        observers.remove(token: token)
    }
    
    // MARK: Fetching Regions
    
    static let queryFragment = """
        regions {
            __typename
            ... on BeaconRegion {
                uuid
                major
                minor
            }
            ... on GeofenceRegion {
                latitude
                longitude
                radius
            }
        }
        """
    
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
        
        var query: GraphQLQuery {
            return .inline(query: """
                query {
                    device(identifier:\"\(FetchQuery.identifier)\") {
                        \(RegionStoreService.queryFragment)
                    }
                }
                """
            )
        }
    }
    
    struct FetchResponse: Decodable {
        struct Data: Decodable {
            struct Device: Decodable {
                var regions: Set<Region>
            }
            
            var device: Device
        }
        
        var data: Data
    }
    
    func fetchRegions(completionHandler: ((FetchRegionsResult) -> Void)?) {
        let operation = FetchQuery()
        let task = client.task(with: operation) {
            let result: FetchRegionsResult
            
            defer {
                completionHandler?(result)
            }
            
            switch $0 {
            case .error(let error, let isRetryable):
                self.logger.error("Failed to fetch regions")
                if let error = error {
                    self.logger.error(error.localizedDescription)
                }
                
                result = FetchRegionsResult.error(error: error, isRetryable: isRetryable)
            case .success(let data):
                do {
                    let decoder = JSONDecoder()
                    decoder.dateDecodingStrategy = .formatted(DateFormatter.rfc3339)
                    let response = try decoder.decode(FetchResponse.self, from: data)
                    let regions = response.data.device.regions
                    self.regions = regions
                    result = FetchRegionsResult.success(regions: regions)
                } catch {
                    self.logger.error("Failed to decode regions from GraphQL response")
                    self.logger.error(error.localizedDescription)
                    result = FetchRegionsResult.error(error: error, isRetryable: false)
                }
            }
        }
        
        task.resume()
    }
}
