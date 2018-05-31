//
//  BlockAction.swift
//  RoverExperiences
//
//  Created by Sean Rucker on 2018-05-14.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

public enum BlockAction {
    case goToScreen(screenID: ID)
    case openURL(url: URL)
    case presentWebsite(url: URL)
}

// MARK: Action

extension BlockAction: Action {
    public func operation(_ resolver: Resolver) -> RoverFoundation.Operation? {
        switch self {
        case .goToScreen(let screenID):
            return resolver.resolve(Operation.self, name: "goToScreen", arguments: screenID)
        case .openURL(let url):
            return resolver.resolve(Operation.self, name: "openURL", arguments: url)
        case .presentWebsite(let url):
            return resolver.resolve(Operation.self, name: "presentWebsite", arguments: url)
        }
    }
}

// MARK: Codable

extension BlockAction: Codable {
    private enum CodingKeys: String, CodingKey {
        case typeName = "__typename"
    }
    
    private enum GoToScreenKeys: String, CodingKey {
        case screenID
    }
    
    private enum OpenURLKeys: String, CodingKey {
        case url
    }
    
    private enum PresentWebsiteKeys: String, CodingKey {
        case url
    }
    
    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let typeName = try container.decode(String.self, forKey: .typeName)
        switch typeName {
        case "GoToScreenAction":
            let container = try decoder.container(keyedBy: GoToScreenKeys.self)
            let screenID = try container.decode(ID.self, forKey: .screenID)
            self = .goToScreen(screenID: screenID)
        case "OpenURLAction":
            let container = try decoder.container(keyedBy: OpenURLKeys.self)
            let url = try container.decode(URL.self, forKey: .url)
            self = .openURL(url: url)
        case "PresentWebsiteAction":
            let container = try decoder.container(keyedBy: PresentWebsiteKeys.self)
            let url = try container.decode(URL.self, forKey: .url)
            self = .presentWebsite(url: url)
        default:
            throw DecodingError.dataCorruptedError(forKey: CodingKeys.typeName, in: container, debugDescription: "Expected one of GoToScreenAction, OpenURLAction or PresentWebsiteAction – found \(typeName)")
        }
    }
    
    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        switch self {
        case .goToScreen(let screenID):
            try container.encode("GoToScreenAction", forKey: .typeName)
            var container = encoder.container(keyedBy: GoToScreenKeys.self)
            try container.encode(screenID, forKey: .screenID)
        case .openURL(let url):
            try container.encode("OpenURLAction", forKey: .typeName)
            var container = encoder.container(keyedBy: OpenURLKeys.self)
            try container.encode(url, forKey: .url)
        case .presentWebsite(let url):
            try container.encode("PresentWebsiteAction", forKey: .typeName)
            var container = encoder.container(keyedBy: PresentWebsiteKeys.self)
            try container.encode(url, forKey: .url)
        }
    }
}

