//
//  Session.swift
//  Experiences
//
//  Created by Sean Rucker on 2018-05-19.
//  Copyright © 2018 Sean Rucker. All rights reserved.
//

import Foundation

class Session {
    static let shared = Session()
    
    struct Info: Codable {
        var accountName: String
        var token: String
        var sdkToken: String
    }
    
    private(set) var info: Info?
    
    var isAuthenticated: Bool {
        return info != nil
    }
    
    init() {
        if let encoded = UserDefaults.standard.object(forKey: "session") as? Data {
            info = try? PropertyListDecoder().decode(Info.self, from: encoded)
        }
    }
    
    enum AuthenticationResult {
        case failed(error: Error?)
        case success
    }
    
    enum AuthenticationError: Error {
        case invalidServerResponse
    }
    
    func authenticate(email: String, password: String, completionHandler: ((AuthenticationResult) -> Void)?) {
        invalidate()
        let url = URL(string: "sessions", relativeTo: APIEndpoint.default.rawValue)!
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let credentials = Credentials(email: email, password: password)
        let payload = try! JSONEncoder().encode(credentials)
        
        let task = URLSession.shared.uploadTask(with: request, from: payload) { (data, response, error) in
            if let error = error {
                let result = AuthenticationResult.failed(error: error)
                completionHandler?(result)
                return
            }
            
            guard let data = data else {
                let result = AuthenticationResult.failed(error: AuthenticationError.invalidServerResponse)
                completionHandler?(result)
                return
            }
            
            let intermediaryResponse: IntermediaryResponse
            
            do {
                intermediaryResponse = try JSONDecoder().decode(IntermediaryResponse.self, from: data)
            } catch {
                let result = AuthenticationResult.failed(error: error)
                completionHandler?(result)
                return
            }
            
            let url = URL(string: "accounts/\(intermediaryResponse.accountID)", relativeTo: APIEndpoint.default.rawValue)!
            
            var request = URLRequest(url: url)
            request.addValue("Bearer \(intermediaryResponse.token)", forHTTPHeaderField: "Authorization")
            
            let task = URLSession.shared.dataTask(with: request) { (data, response, error) in
                if let error = error {
                    let result = AuthenticationResult.failed(error: error)
                    completionHandler?(result)
                    return
                }
                
                guard let data = data else {
                    let result = AuthenticationResult.failed(error: AuthenticationError.invalidServerResponse)
                    completionHandler?(result)
                    return
                }
                
                let finalResponse: FinalResponse
                
                do {
                    finalResponse = try JSONDecoder().decode(FinalResponse.self, from: data)
                } catch {
                    let result = AuthenticationResult.failed(error: error)
                    completionHandler?(result)
                    return
                }
                
                let info = Info(accountName: finalResponse.title, token: intermediaryResponse.token, sdkToken: finalResponse.token)
                self.info = info
                
                if let encoded = try? PropertyListEncoder().encode(info) {
                    UserDefaults.standard.set(encoded, forKey: "session")
                }
                
                completionHandler?(.success)
                NotificationCenter.default.post(name: .didAuthenticate, object: self)
            }
            
            task.resume()
        }
        
        task.resume()
    }
    
    func invalidate() {
        if !isAuthenticated {
            return
        }
        
        info = nil
        UserDefaults.standard.removeObject(forKey: "session")
        NotificationCenter.default.post(name: .didInvalidate, object: self)
    }
    
    func authorize(request: inout URLRequest) {
        guard let info = info else {
            return
        }
        
        request.addValue("Bearer \(info.token)", forHTTPHeaderField: "Authorization")
    }
}

// MARK: Notification.Name

extension Notification.Name {
    static let didAuthenticate = Notification.Name("didAuthenticate")
    static let didInvalidate = Notification.Name("didInvalidate")
}

// MARK: Credentials

fileprivate struct Credentials: Encodable {
    var email: String
    var password: String

    private enum CodingKeys: String, CodingKey {
        case data
    }
    
    private enum DataKeys: String, CodingKey {
        case attributes
        case type
    }
    
    private enum AttributesKeys: String, CodingKey {
        case email
        case password
    }
    
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        var dataContainer = container.nestedContainer(keyedBy: DataKeys.self, forKey: .data)
        try dataContainer.encode("sessions", forKey: .type)
        var attributesContainer = dataContainer.nestedContainer(keyedBy: AttributesKeys.self, forKey: .attributes)
        try attributesContainer.encode(email, forKey: .email)
        try attributesContainer.encode(password, forKey: .password)
    }
}

// MARK: IntermediaryResponse

fileprivate struct IntermediaryResponse: Decodable {
    var accountID: String
    var token: String
    
    private enum CodingKeys: String, CodingKey {
        case data
    }
    
    private enum DataKeys: String, CodingKey {
        case attributes
        case relationships
    }
    
    private enum AttributesKeys: String, CodingKey {
        case token
    }
    
    private enum RelationshipsKeys: String, CodingKey {
        case account
    }
    
    private enum AccountKeys: String, CodingKey {
        case data
    }
    
    private enum AccountDataKeys: String, CodingKey {
        case id
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let dataContainer = try container.nestedContainer(keyedBy: DataKeys.self, forKey: .data)
        let attributesContainer = try dataContainer.nestedContainer(keyedBy: AttributesKeys.self, forKey: .attributes)
        token = try attributesContainer.decode(String.self, forKey: .token)
        let relationshipsContainer = try dataContainer.nestedContainer(keyedBy: RelationshipsKeys.self, forKey: .relationships)
        let accountContainer = try relationshipsContainer.nestedContainer(keyedBy: AccountKeys.self, forKey: .account)
        let accountDataContainer = try accountContainer.nestedContainer(keyedBy: AccountDataKeys.self, forKey: .data)
        accountID = try accountDataContainer.decode(String.self, forKey: .id)
    }
}

// MARK: FinalResponse

fileprivate struct FinalResponse: Decodable {
    var title: String
    var token: String
    
    private enum CodingKeys: String, CodingKey {
        case data
    }
    
    private enum DataKeys: String, CodingKey {
        case attributes
    }
    
    private enum AttributesKeys: String, CodingKey {
        case title
        case token
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let dataContainer = try container.nestedContainer(keyedBy: DataKeys.self, forKey: .data)
        let attributesContainer = try dataContainer.nestedContainer(keyedBy: AttributesKeys.self, forKey: .attributes)
        title = try attributesContainer.decode(String.self, forKey: .title)
        token = try attributesContainer.decode(String.self, forKey: .token)
    }
}
