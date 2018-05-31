//
//  URLSession+HTTPSession.swift
//  RoverFoundation
//
//  Created by Sean Rucker on 2018-05-02.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

extension URLSession: HTTPSession {
    func downloadTask(with request: URLRequest, completionHandler: @escaping (Data?, URLResponse?, Error?) -> Void) -> HTTPTask {
        return (dataTask(with: request, completionHandler: completionHandler) as URLSessionDataTask) as HTTPTask
    }
    
    func uploadTask(with request: URLRequest, from bodyData: Data?, completionHandler: @escaping (Data?, URLResponse?, Error?) -> Void) -> HTTPTask {
        return (uploadTask(with: request, from: bodyData, completionHandler: completionHandler) as URLSessionUploadTask) as HTTPTask
    }
}
