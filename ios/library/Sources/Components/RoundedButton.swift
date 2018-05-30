//
//  RoundedButton.swift
//  Experiences
//
//  Created by Sean Rucker on 2018-05-19.
//  Copyright © 2018 Sean Rucker. All rights reserved.
//

import UIKit

@IBDesignable open class RoundedButton: UIButton {
    open override var intrinsicContentSize: CGSize {
        return CGSize(width: UIViewNoIntrinsicMetric, height: 60)
    }
    
    public required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        
        setBackgroundImages()
        setTitleFont()
        roundCorners()
    }
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        
        setBackgroundImages()
        setTitleColors()
        setTitleFont()
        roundCorners()
    }
    
    open override func tintColorDidChange() {
        setBackgroundImages()
    }
    
    func setBackgroundImages() {
        setBackgroundImage(tintColor.image, for: .normal)
        setBackgroundImage(tintColor.withAlphaComponent(0.5).image, for: .highlighted)
        setBackgroundImage(UIColor.dusk.image, for: .disabled)
    }
    
    func setTitleColors() {
        setTitleColor(UIColor.white, for: .normal)
        setTitleColor(UIColor.afternoon, for: .disabled)
    }
    
    open func setTitleFont() {
        titleLabel?.font = UIFont.systemFont(ofSize: 16, weight: UIFont.Weight.semibold)
    }
    
    open func roundCorners() {
        layer.cornerRadius = 4
        clipsToBounds = true
    }
}
