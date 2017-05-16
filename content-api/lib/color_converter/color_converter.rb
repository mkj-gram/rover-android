module ColorConverter
    class << self
        
        def hue2rgb(p, q, t)
            p = p.to_f
            q = q.to_f
            t = t.to_f
            t += 1 if t < 0
            t -= 1 if t > 1
            return p + ( q - p) * 6 * t if t < 1/6.0
            return q if t < 1/2.0
            return p + (q - p) * (2/3.0 - t) * 6 if t < 2/3.0
            return p
        end

        def hslToRgb(h,s, l)
            if s == 0
                r = g = b = l
            else
                q = l < 0.5 ? l * (1 + s) : l + s - l * s
                p = 2 * l - q
                r = hue2rgb(p, q, h + 1/3.0)
                g = hue2rgb(p, q, h)
                b = hue2rgb(p, q, h - 1/3.0)
            end

            return [(r * 255).round, (g * 255).round, (b * 255).round]
        end

        def rgbToHsl(r,g,b)
            r = r / 255.0
            g = g / 255.0
            b = b / 255.0
            max = [r,g,b].max
            min = [r,g,b].min
            h = s = l = (max + min) / 2.0

            if (max == min)
                h = s = 0;
            else
                d = max - min
                s = l > 0.5 ? d / (2- max -min) : d / (max + min)
                case max
                when r
                    h = ( g - b ) / d + (g < b ? 6 : 0)
                when g
                    h = (b - r) / d + 2
                when b
                    h = (r - g) / d + 4  
                end
                h = h / 6.0
            end
            return [h, s, l]
        end

    end
end
