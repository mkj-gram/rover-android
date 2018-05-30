//
//  UIColor.swift
//  Components
//
//  Created by Sean Rucker on 2018-05-19.
//  Copyright © 2018 Sean Rucker. All rights reserved.
//

extension UIColor {
    public var image: UIImage? {
        let rect = CGRect(x: 0, y: 0, width: 1, height: 1)
        UIGraphicsBeginImageContext(rect.size)
        let context = UIGraphicsGetCurrentContext()
        context?.setFillColor(cgColor)
        context?.fill(rect)
        let image = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()
        return image
    }
}

// MARK: Grayscale

extension UIColor {
    public class var charcoal: UIColor {
        return UIColor(red: 50/255, green: 50/255, blue: 50/255, alpha: 1)
    }
    
    public class var graphite: UIColor {
        return UIColor(red: 93/255, green: 93/255, blue: 93/255, alpha: 1)
    }
    
    public class var steel: UIColor {
        return UIColor(red: 129/255, green: 129/255, blue: 129/255, alpha: 1)
    }
    
    public class var silver: UIColor {
        return UIColor(red: 188/255, green: 188/255, blue: 188/255, alpha: 1)
    }
    
    public class var titanium: UIColor {
        return UIColor(red: 216/255, green: 216/255, blue: 216/255, alpha: 1)
    }
    
    public class var mercury: UIColor {
        return UIColor(red: 233/255, green: 233/255, blue: 233/255, alpha: 1)
    }
    
    public class var cloud: UIColor {
        return UIColor(red: 238/255, green: 238/255, blue: 238/255, alpha: 1)
    }
    
    public class var quartz: UIColor {
        return UIColor(red: 245/255, green: 245/255, blue: 245/255, alpha: 1)
    }
    
    public class var almostWhite: UIColor {
        return UIColor(red: 251/255, green: 251/255, blue: 251/255, alpha: 1)
    }
}

// MARK: Status

extension UIColor {
    public class var red: UIColor {
        return UIColor(red: 227/255, green: 122/255, blue: 72/255, alpha: 1)
    }
    
    public class var yellow: UIColor {
        return UIColor(red: 231/255, green: 177/255, blue: 88/255, alpha: 1)
    }
    
    public class var green: UIColor {
        return UIColor(red: 52/255, green: 203/255, blue: 179/255, alpha: 1)
    }
    
    public class var paleRed: UIColor {
        return UIColor(red: 254/255, green: 241/255, blue: 235/255, alpha: 1)
    }
    
    public class var paleYellow: UIColor {
        return UIColor(red: 253/255, green: 247/255, blue: 237/255, alpha: 1)
    }
    
    public class var paleGreen: UIColor {
        return UIColor(red: 230/255, green: 250/255, blue: 247/255, alpha: 1)
    }
}

// MARK: Other

extension UIColor {
    public class var aloe: UIColor {
        return UIColor(red: 130/255, green: 229/255, blue: 180/255, alpha: 1)
    }
    
    public class var dodgerBlue: UIColor {
        return UIColor(red: 53/255, green: 167/255, blue: 248/255, alpha: 1)
    }
    
    public class var teal: UIColor {
        return UIColor(red: 42/255, green: 197/255, blue: 214/255, alpha: 1)
    }
    
    public class var mint: UIColor {
        return UIColor(red: 89/255, green: 215/255, blue: 153/255, alpha: 1)
    }
    
    public class var lavender: UIColor {
        return UIColor(red: 147/255, green: 158/255, blue: 194/255, alpha: 1)
    }
    
    public class var afternoon: UIColor {
        return UIColor(red: 95/255, green: 104/255, blue: 132/255, alpha: 1)
    }
    
    public class var dusk: UIColor {
        return UIColor(red: 43/255, green: 49/255, blue: 66/255, alpha: 1)
    }
    
    public class var twilight: UIColor {
        return UIColor(red: 29/255, green: 33/255, blue: 46/255, alpha: 1)
    }
    
    public class var pink: UIColor {
        return UIColor(red: 236/255, green: 118/255, blue: 150/255, alpha: 1)
    }
}
