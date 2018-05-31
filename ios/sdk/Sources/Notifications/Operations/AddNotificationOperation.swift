//
//  AddNotificationOperation.swift
//  RoverNotifications
//
//  Created by Sean Rucker on 2018-05-11.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

class AddNotificationOperation: RoverFoundation.Operation {
    let dispatcher: Dispatcher
    let eventQueue: EventQueue
    let notification: Notification
    let notificationCenter: UIViewController
    let notificationStore: NotificationStore
    
    init(dispatcher: Dispatcher, eventQueue: EventQueue, notification: Notification, notificationCenter: UIViewController, notificationStore: NotificationStore) {
        self.dispatcher = dispatcher
        self.eventQueue = eventQueue
        self.notification = notification
        self.notificationCenter = notificationCenter
        self.notificationStore = notificationStore
        super.init()
        name = "Add Notification"
    }
    
    override func execute() {
        notificationStore.addNotification(notification)
        
        // If the notification exists in the notification center and the notification center can handle opening the notification, present the notification center and then delegate the task of opening the notification to the notification center. Otherwise handle opening the notification here.
        
        if notification.isNotificationCenterEnabled, let notificationHandler = notificationCenter as? NotificationHandler {
            let presentNotificationCenter = PresentNotificationCenterAction()
            if let operation = dispatcher.dispatch(presentNotificationCenter) {
                let observer = BlockObserver { (_, _) in
                    notificationHandler.openNotification(self.notification)
                    self.finish()
                }
                
                operation.addObserver(observer: observer)
            } else {
                notificationHandler.openNotification(self.notification)
                finish()
            }
        } else {
            openNotification(notification)
            finish()
        }
    }
}

// MARK: NotificationHandler

extension AddNotificationOperation: NotificationHandler {
    func openNotification(_ notification: Notification) {
        if !notification.isRead {
            notificationStore.markNotificationRead(notification.id)
        }
        
        if let action = notification.action {
            dispatcher.dispatch(action)
        }
        
        let eventInfo = notification.openedEvent()
        eventQueue.addEvent(eventInfo)
    }
}
