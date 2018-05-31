//
//  GraphQLOperation.swift
//  RoverFoundation
//
//  Created by Sean Rucker on 2018-05-02.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

public enum GraphQLQuery {
    case inline(query: String)
    case persisted(id: Int)
}

extension GraphQLQuery {
    var queryItem: URLQueryItem {
        switch self {
        case .inline(let query):
            let condensed = query.components(separatedBy: .whitespacesAndNewlines).filter { !$0.isEmpty }.joined(separator: " ")
            return URLQueryItem(name: "query", value: condensed)
        case .persisted(let id):
            return URLQueryItem(name: "id", value: String(id))
        }
    }
}

public protocol GraphQLOperation: Encodable {
    associatedtype Variables: Encodable
    
    var operationType: GraphQLOperationType { get }
    var query: GraphQLQuery { get }
    var variables: Variables? { get }
}

fileprivate enum CodingKeys: String, CodingKey {
    case query
    case id
    case variables
}

extension GraphQLOperation {
    public var operationType: GraphQLOperationType {
        return .query
    }
    
    public var variables: Attributes? {
        return nil
    }
    
    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        
        switch query {
        case .inline(let query):
            try container.encode(query, forKey: .query)
        case .persisted(let id):
            try container.encode(id, forKey: .id)
        }
        
        if let variables = variables {
            try container.encode(variables, forKey: .variables)
        }
    }
}
