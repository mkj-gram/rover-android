//
//  ButtonBlock.swift
//  RoverExperiences
//
//  Created by Sean Rucker on 2018-04-24.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

public struct ButtonBlock: Block {
    public var action: BlockAction?
    public var background: Background
    public var border: Border
    public var id: ID
    public var insets: Insets
    public var opacity: Double
    public var position: Position
    public var text: Text
    public var keys: [String: String]
    public var tags: [String]
    
    public init(action: BlockAction?, background: Background, border: Border, id: ID, insets: Insets, opacity: Double, position: Position, text: Text, keys: [String: String], tags: [String]) {
        self.action = action
        self.background = background
        self.border = border
        self.id = id
        self.insets = insets
        self.opacity = opacity
        self.position = position
        self.text = text
        self.keys = keys
        self.tags = tags
    }
}
