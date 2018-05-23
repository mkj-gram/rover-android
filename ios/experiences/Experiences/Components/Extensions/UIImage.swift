//
//  UIImage.swift
//  Experiences
//
//  Created by Sean Rucker on 2018-05-19.
//  Copyright © 2018 Sean Rucker. All rights reserved.
//

import UIKit

extension UIImage {
    public static func tintImage(image: UIImage, color: UIColor) -> UIImage? {
        let size = image.size
        
        UIGraphicsBeginImageContextWithOptions(size, false, image.scale)
        let context = UIGraphicsGetCurrentContext()
        image.draw(at: CGPoint.zero, blendMode: CGBlendMode.normal, alpha: 1)
        
        context?.setFillColor(color.cgColor)
        context?.setBlendMode(CGBlendMode.sourceIn)
        context?.setAlpha(1)
        
        let rect = CGRect(x: 0, y: 0, width: image.size.width, height: image.size.height)
        context?.fill(rect)
        
        let tintedImage = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()
        
        return tintedImage
    }
}
