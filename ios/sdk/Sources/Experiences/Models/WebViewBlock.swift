//
//  WebViewBlock.swift
//  RoverExperiences
//
//  Created by Sean Rucker on 2018-04-24.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

public struct WebViewBlock: Block {
    public var action: BlockAction?
    public var background: Background
    public var border: Border
    public var id: ID
    public var insets: Insets
    public var opacity: Double
    public var position: Position
    public var webView: WebView
    public var keys: [String: String]
    public var tags: [String]
    
    public init(action: BlockAction?, background: Background, border: Border, id: ID, insets: Insets, opacity: Double, position: Position, webView: WebView, keys: [String: String], tags: [String]) {
        self.action = action
        self.background = background
        self.border = border
        self.id = id
        self.insets = insets
        self.opacity = opacity
        self.position = position
        self.webView = webView
        self.keys = keys
        self.tags = tags
    }
}
