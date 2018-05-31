//
//  VersionTrackerService.swift
//  RoverApplication
//
//  Created by Sean Rucker on 2018-02-21.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

import RoverEvents
import RoverFoundation

class VersionTrackerService: VersionTracker {
    let bundle: Bundle
    let eventQueue: EventQueue
    let logger: Logger
    let userDefaults: UserDefaults
    
    lazy var info: [String: Any] = {
        var info = [String: Any]()
        
        if let infoDictionary = bundle.infoDictionary {
            for (key, value) in infoDictionary {
                info[key] = value
            }
        } else {
            logger.warn("Failed to load infoDictionary from bundle")
        }
        
        if let localizedInfoDictionary = bundle.localizedInfoDictionary {
            for (key, value) in localizedInfoDictionary {
                info[key] = value
            }
        }
        
        return info
    }()
    
    lazy var appVersion: String? = {
        guard let shortVersion = info["CFBundleShortVersionString"] as? String else {
            logger.warn("Failed to capture appVersion")
            return nil
        }
        
        return shortVersion
    }()
    
    lazy var appBuild: String? = {
        guard let bundleVersion = info["CFBundleVersion"] as? String else {
            logger.warn("Failed to capture appBuild")
            return nil
        }
        
        return bundleVersion
    }()
    
    init(bundle: Bundle, eventQueue: EventQueue, logger: Logger, userDefaults: UserDefaults) {
        self.bundle = bundle
        self.eventQueue = eventQueue
        self.logger = logger
        self.userDefaults = userDefaults
    }
    
    func trackAppVersion() {
        logger.debug("Tracking app version")
        
        let currentVersion = appVersion
        let currentBuild = appBuild
        
        let versionString: (String?, String?) -> String = { version, build in
            if let version = version {
                if let build = build {
                    return "\(version) (\(build))"
                }
                
                return "\(version)"
            }
            
            return "n/a"
        }
        
        let currentVersionString = versionString(currentVersion, currentBuild)
        logger.debug("Current version: \(currentVersionString)")
        
        let previousVersion = userDefaults.string(forKey: "io.rover.appVersion")
        let previousBuild = userDefaults.string(forKey: "io.rover.appBuild")
        
        let previousVersionString = versionString(previousVersion, previousBuild)
        logger.debug("Previous version: \(previousVersionString)")
        
        if previousVersion == nil || previousBuild == nil {
            logger.debug("Previous version not found – first time running app with Rover")
            trackAppInstalled()
        } else if currentVersion != previousVersion || currentBuild != previousBuild {
            logger.debug("Current and previous versions do not match – app has been updated")
            trackAppUpdated(fromVersion: previousVersion, build: previousBuild)
        } else {
            logger.debug("Current and previous versions match – nothing to track")
        }
        
        userDefaults.set(currentVersion, forKey: "io.rover.appVersion")
        userDefaults.set(currentBuild, forKey: "io.rover.appBuild")
    }
    
    func trackAppInstalled() {
        let event = EventInfo(name: "App Installed", namespace: "rover")
        eventQueue.addEvent(event)
    }
    
    func trackAppUpdated(fromVersion previousVersion: String?, build previousBuild: String?) {
        var attributes = Attributes()
        if let previousVersion = previousVersion {
            attributes["previousVersion"] = previousVersion
        }
        
        if let previousBuild = previousBuild {
            attributes["previousBuild"] = previousBuild
        }
        
        let event = EventInfo(name: "App Updated", namespace: "rover", attributes: attributes)
        eventQueue.addEvent(event)
    }
}
