//
//  NotificationStoreService.swift
//  RoverNotifications
//
//  Created by Sean Rucker on 2018-03-07.
//  Copyright © 2018 Sean Rucker. All rights reserved.
//

class NotificationStoreService: NotificationStore {
    let client: APIClient
    let eventQueue: EventQueue?
    let logger: Logger
    let maxSize: Int
    
    var notifications = [Notification]() {
        didSet {
            observers.notify(parameters: notifications)
        }
    }
    
    var observers = ObserverSet<[Notification]>()
    var stateObservation: NSObjectProtocol?
    
    init(maxSize: Int, client: APIClient, eventQueue: EventQueue?, logger: Logger, stateFetcher: StateFetcher) {
        self.client = client
        self.eventQueue = eventQueue
        self.logger = logger
        self.maxSize = maxSize
        
        stateFetcher.addQueryFragment(NotificationStoreService.queryFragment)
        
        stateObservation = stateFetcher.addObserver { data in
            let decoder = JSONDecoder()
            decoder.dateDecodingStrategy = .formatted(DateFormatter.rfc3339)
            if let response = try? decoder.decode(FetchResponse.self, from: data) {
                self.mergeNotifications(response.data.device.notifications)
            }
        }
    }
    
    // MARK: Observers
    
    func addObserver(block: @escaping ([Notification]) -> Void) -> NSObjectProtocol {
        return observers.add(block: block)
    }
    
    func removeObserver(_ token: NSObjectProtocol) {
        observers.remove(token: token)
    }
    
    // MARK: File Storage
    
    var cache: URL? {
        return FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask).first?.appendingPathComponent("notifications").appendingPathExtension("plist")
    }
    
    func restore() {
        logger.debug("Restoring notifications from cache")
        
        guard let cache = cache else {
            logger.error("Failed to restore notifications from cache: Cache not found")
            return
        }
        
        if !FileManager.default.fileExists(atPath: cache.path) {
            logger.debug("Cache is empty, no notifications to restore")
            return
        }
        
        do {
            let data = try Data(contentsOf: cache)
            notifications = try PropertyListDecoder().decode([Notification].self, from: data)
            logger.debug("\(notifications.count) notification(s) restored from cache")
        } catch {
            logger.error("Failed to restore notifications from cache")
            logger.error(error.localizedDescription)
        }
    }
    
    func persist() {
        logger.debug("Persisting notifications to cache...")
        
        guard let cache = cache else {
            logger.error("Cache not found")
            return
        }
        
        do {
            let encoder = PropertyListEncoder()
            encoder.outputFormat = .xml
            let data = try encoder.encode(notifications)
            try data.write(to: cache, options: [.atomic])
            logger.debug("Cache now contains \(notifications.count) notification(s)")
        } catch {
            self.logger.error("Failed to persist notifications to cache")
            self.logger.error(error.localizedDescription)
        }
    }
    
    // MARK: Fetching Notifications
    
    static let queryFragment = """
        notifications {
            id
            campaignID
            title
            body
            attachment {
                type
                url
            }
            action {
                __typename
                ...on OpenURLAction {
                    url
                }
                ...on PresentExperienceAction {
                    campaignID
                }
                ...on PresentWebsiteAction {
                    url
                }
            }
            deliveredAt
            expiresAt
            isRead
            isNotificationCenterEnabled
            isDeleted
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
                        \(NotificationStoreService.queryFragment)
                    }
                }
                """
            )
        }
    }
    
    struct FetchResponse: Decodable {
        struct Data: Decodable {
            struct Device: Decodable {
                var notifications: [Notification]
            }
            
            var device: Device
        }
        
        var data: Data
    }
    
    func fetchNotifications(completionHandler: ((FetchNotificationsResult) -> Void)?) {
        let operation = FetchQuery()
        let task = client.task(with: operation) {
            let result: FetchNotificationsResult
            
            defer {
                completionHandler?(result)
            }
            
            switch $0 {
            case .error(let error, let isRetryable):
                self.logger.error("Failed to fetch notifications")
                if let error = error {
                    self.logger.error(error.localizedDescription)
                }
                
                result = .error(error: error, isRetryable: isRetryable)
            case .success(let data):
                do {
                    let decoder = JSONDecoder()
                    decoder.dateDecodingStrategy = .formatted(DateFormatter.rfc3339)
                    let response = try decoder.decode(FetchResponse.self, from: data)
                    let notifications = response.data.device.notifications
                    self.mergeNotifications(notifications)
                    result = .success(notifications: notifications)
                } catch {
                    self.logger.error("Failed to decode notifications from GraphQL response")
                    self.logger.error(error.localizedDescription)
                    result = .error(error: error, isRetryable: false)
                }
            }
        }
        
        task.resume()
    }
    
    // MARK: Adding Notifications
    
    func addNotification(_ notification: Notification) {
        mergeNotifications([notification])
    }
    
    func mergeNotifications(_ notifications: [Notification]) {
        let map: ([Notification]) -> [ID: Notification] = { notifications in
            let ids = notifications.map { $0.id }
            let zipped = zip(ids, notifications)
            return Dictionary(zipped, uniquingKeysWith: { (a, b) in
                return a
            })
        }
        
        let existing = map(self.notifications)
        let new = map(notifications)
        let merged = existing.merging(new, uniquingKeysWith: {
            var notification = $1
            notification.isRead = $0.isRead || $1.isRead
            notification.isDeleted = $0.isDeleted || $1.isDeleted
            return notification
        })
        
        let sorted = merged.values.sorted(by: { $0.deliveredAt > $1.deliveredAt })
        let trimmed = sorted.prefix(maxSize)
        self.notifications = Array(trimmed)
        persist()
    }
    
    // MARK: Updating Notifications
    
    func markNotificationDeleted(_ notificationID: ID) {
        notifications = notifications.map({
            if $0.id != notificationID {
                return $0
            }
            
            var notification = $0
            notification.isDeleted = true
            return notification
        })
        
        persist()
        
        guard let eventQueue = eventQueue else {
            return
        }
        
        let attributes: Attributes = ["notificationID": notificationID.rawValue]
        let event = EventInfo(name: "Notification Marked Deleted", namespace: "rover", attributes: attributes)
        eventQueue.addEvent(event)
    }
    
    func markNotificationRead(_ notificationID: ID) {
        self.notifications = notifications.map({
            if $0.id != notificationID {
                return $0
            }
            
            var notification = $0
            notification.isRead = true
            return notification
        })
        
        persist()
        
        guard let eventQueue = eventQueue else {
            return
        }
        
        let attributes: Attributes = ["notificationID": notificationID.rawValue]
        let event = EventInfo(name: "Notification Marked Read", namespace: "rover", attributes: attributes)
        eventQueue.addEvent(event)
    }
}
