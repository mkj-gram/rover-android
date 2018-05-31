//
//  TelephonyContextProvider.swift
//  RoverEvents
//
//  Created by Sean Rucker on 2018-03-01.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

import CoreTelephony

class TelephonyContextProvider: ContextProvider {
    let logger: Logger
    let telephonyNetworkInfo = CTTelephonyNetworkInfo()
    
    var carrierName: String? {
        guard let carrierName = telephonyNetworkInfo.subscriberCellularProvider?.carrierName else {
            logger.warn("Failed to capture carrier name (this is expected behaviour if you are running a simulator)")
            return nil
        }
        
        return carrierName
    }
    
    var radio: String? {
        var radio = telephonyNetworkInfo.currentRadioAccessTechnology
        let prefix = "CTRadioAccessTechnology"
        if radio == nil {
            radio = "None"
        } else if radio!.hasPrefix(prefix) {
            radio = (radio! as NSString).substring(from: prefix.count)
        }
        
        if let radio = radio {
            return radio
        } else {
            logger.warn("Failed to capture radio")
            return nil
        }
    }
    
    init(logger: Logger) {
        self.logger = logger
    }
    
    func captureContext(_ context: Context) -> Context {
        var nextContext = context
        nextContext.carrierName = carrierName
        nextContext.radio = radio
        return nextContext
    }
}
