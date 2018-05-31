//
//  BarcodeBlock.swift
//  RoverExperiences
//
//  Created by Sean Rucker on 2018-04-24.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

public struct BarcodeBlock: Block {
    public var action: BlockAction?
    public var background: Background
    public var barcode: Barcode
    public var border: Border
    public var id: ID
    public var insets: Insets
    public var opacity: Double
    public var position: Position
    public var keys: [String: String]
    public var tags: [String]
    
    public init(action: BlockAction?, background: Background, barcode: Barcode, border: Border, id: ID, insets: Insets, opacity: Double, position: Position, keys: [String: String], tags: [String]) {
        self.action = action
        self.background = background
        self.barcode = barcode
        self.border = border
        self.id = id
        self.insets = insets
        self.opacity = opacity
        self.position = position
        self.keys = keys
        self.tags = tags
    }
}
