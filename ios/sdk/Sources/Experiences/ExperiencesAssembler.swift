//
//  ExperiencesAssembler.swift
//  RoverExperiences
//
//  Created by Sean Rucker on 2018-05-04.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

fileprivate typealias Operation = RoverFoundation.Operation

public struct ExperiencesAssembler: Assembler {
    public init() { }
    
    public func assemble(container: Container) {
        
        // MARK: ExperienceStore
        
        container.register(ExperienceStore.self) { resolver in
            let client = resolver.resolve(APIClient.self)!
            let logger = resolver.resolve(Logger.self)!
            return ExperienceStoreService(client: client, logger: logger)
        }
        
        // MARK: Operation (goToScreen)
        
        container.register(Operation.self, name: "goToScreen", scope: .transient) { (resolver, screenID: ID) in
            return GoToScreenOperation(screenID: screenID, viewControllerProvider: { (experience, screen) in
                return resolver.resolve(UIViewController.self, name: "screen", arguments: experience, screen)!
            })
        }
        
        // MARK: Operation (presentExperience)
        
        container.register(Operation.self, name: "presentExperience", scope: .transient) { (resolver, campaignID: ID) in
            let identifier = ExperienceIdentifier.campaignID(id: campaignID)
            return resolver.resolve(Operation.self, name: "presentExperience", arguments: identifier)!
        }
        
        container.register(Operation.self, name: "presentExperience", scope: .transient) { (resolver, identifier: ExperienceIdentifier) in
            let viewControllerToPresent = resolver.resolve(UIViewController.self, name: "experience", arguments: identifier)!
            let logger = resolver.resolve(Logger.self)!
            return PresentViewOperation(viewControllerToPresent: viewControllerToPresent, animated: true, logger: logger)
        }
        
        // MARK: Operation (universalLink)
        
        container.register(Operation.self, name: "universalLink", scope: .transient) { (resolver, url: URL) in
            let identifier = ExperienceIdentifier.campaignURL(url: url)
            return resolver.resolve(Operation.self, name: "presentExperience", arguments: identifier)!
        }
        
        // MARK: UICollectionViewLayout (screen)
        
        container.register(UICollectionViewLayout.self, name: "screen", scope: .transient) { (resolver, screen: Screen) in
            return ScreenViewLayout(screen: screen)
        }
        
        // MARK: UIViewController (experience)
        
        container.register(UIViewController.self, name: "experience", scope: .transient) { (resolver, identifier: ExperienceIdentifier) in
            let store = resolver.resolve(ExperienceStore.self)!
            
            if let experience = store.experience(for: identifier) {
                return resolver.resolve(UIViewController.self, name: "experience", arguments: experience)!
            }
            
            return ExperienceContainer(identifier: identifier, store: store, viewControllerProvider: { experience in
                return resolver.resolve(UIViewController.self, name: "experience", arguments: experience)!
            })
        }
        
        container.register(UIViewController.self, name: "experience", scope: .transient) { (resolver, experience: Experience) in
            let screenViewController = resolver.resolve(UIViewController.self, name: "screen", arguments: experience, experience.homeScreen)!
            let eventQueue = resolver.resolve(EventQueue.self)
            let sessionController = resolver.resolve(SessionController.self)!
            return NavigationExperienceController(rootViewController: screenViewController, experience: experience, eventQueue: eventQueue, sessionController: sessionController)
        }
        
        // MARK: UIViewController (screen)
        
        container.register(UIViewController.self, name: "screen", scope: .transient) { (resolver, experience: Experience, screen: Screen) in
            let collectionViewLayout = resolver.resolve(UICollectionViewLayout.self, name: "screen", arguments: screen)!
            let dispatcher = resolver.resolve(Dispatcher.self)!
            let eventQueue = resolver.resolve(EventQueue.self)
            let imageStore = resolver.resolve(ImageStore.self)!
            let sessionController = resolver.resolve(SessionController.self)!
            return ScreenViewController(collectionViewLayout: collectionViewLayout, experience: experience, screen: screen, dispatcher: dispatcher, eventQueue: eventQueue, imageStore: imageStore, sessionController: sessionController)
        }
    }
}
