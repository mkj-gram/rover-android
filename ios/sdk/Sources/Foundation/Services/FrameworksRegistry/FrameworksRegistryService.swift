//
//  FrameworksRegistryService.swift
//  RoverFoundation
//
//  Created by Sean Rucker on 2018-03-11.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

class FrameworksRegistryService: FrameworksRegistry {
    let logger: Logger
    
    var identifiers = [String]()
    var versionMap = [String: String]()
    
    init(logger: Logger) {
        self.logger = logger
    }
    
    func register(_ identifier: String) {
        identifiers.append(identifier)
        versionMap = identifiers.reduce([String: String](), { (result, identifier) in
            guard let bundle = bundle(for: identifier), let version = version(from: bundle) else {
                return result
            }
            
            var nextResult = result
            nextResult[identifier] = version
            return nextResult
        })
    }
    
    func bundle(for identifier: String) -> Bundle? {
        if let bundle = Bundle(identifier: identifier) {
            return bundle
        }
        
        if identifier.starts(with: "io.rover") {
            let cocoapods = identifier.replacingOccurrences(of: "io.rover", with: "org.cocoapods")
            if let bundle = Bundle(identifier: cocoapods) {
                return bundle
            }
        }
        
        logger.warn("Failed to capture framework version: No bundle found for identifier \(identifier)")
        return nil
    }
    
    func version(from bundle: Bundle) -> String? {
        guard let dictionary = bundle.infoDictionary else {
            logger.warn("Failed to capture framework version: Invalid bundle")
            return nil
        }
        
        guard let version = dictionary["CFBundleShortVersionString"] as? String else {
            logger.warn("Failed to capture framework version: No version found in bundle")
            return nil
        }
        
        return version
    }
}
