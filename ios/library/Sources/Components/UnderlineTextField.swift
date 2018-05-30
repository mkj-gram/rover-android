//
//  UnderlineTextField.swift
//  Experiences
//
//  Created by Sean Rucker on 2018-05-19.
//  Copyright © 2018 Sean Rucker. All rights reserved.
//

import UIKit

@IBDesignable open class UnderlineTextField: UITextField {
    open override var placeholder: String? {
        didSet {
            guard let placeholder = self.placeholder else {
                return
            }
            
            attributedPlaceholder = NSAttributedString(string: placeholder, attributes: [NSAttributedStringKey.foregroundColor: UIColor.lavender])
        }
    }
    
    required public init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        setTextColor()
        overrideAttributes()
        tintClearButton()
    }
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setTextColor()
        overrideAttributes()
        tintClearButton()
    }
    
    open override func layoutSubviews() {
        super.layoutSubviews()
        tintClearButton()
    }
    
    override open func draw(_ rect: CGRect) {
        let path = UIBezierPath()
        path.move(to: CGPoint(x: 0.0, y: rect.height))
        path.addLine(to: CGPoint(x: rect.origin.x + rect.width, y: rect.height))
        UIColor.lavender.setStroke()
        path.stroke()
    }
    
    private func setTextColor() {
        textColor = UIColor.white// tintColor
    }
    
    private func overrideAttributes() {
        font = UIFont.systemFont(ofSize: 18.0, weight: UIFont.Weight.light)
        borderStyle = UITextBorderStyle.none
    }
    
    private var normalClearButton: UIImage?
    private var highlightedClearButton: UIImage?
    
    private func tintClearButton() {
        for view in subviews {
            if let button = view as? UIButton {
                if let image = button.image(for: .highlighted) {
                    let normalClearButton = self.normalClearButton ?? UIImage.tintImage(image: image, color: UIColor.lavender)
                    button.setImage(normalClearButton, for: .normal)
                    
                    let highlightedClearButton = self.highlightedClearButton ?? UIImage.tintImage(image: image, color: UIColor.afternoon)
                    button.setImage(highlightedClearButton, for: .highlighted)
                }
            }
        }
    }
}

