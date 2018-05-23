//
//  TableHeader.swift
//  Experiences
//
//  Created by Sean Rucker on 2018-05-20.
//  Copyright © 2018 Sean Rucker. All rights reserved.
//

import UIKit

class TableHeader: UIView {
    override func draw(_ rect: CGRect) {
        let path = UIBezierPath()
        path.move(to: CGPoint(x: 0.0, y: rect.height))
        path.addLine(to: CGPoint(x: rect.origin.x + rect.width, y: rect.height))
        
        UIColor.titanium.setStroke()
        path.stroke()
    }
}
