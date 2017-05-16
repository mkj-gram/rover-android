module V1::GimbalPlaceSerializer
    class << self
        def serialize(gimbal_place, extra_attributes = {})
        	{
        		type: 'gimbal-places',
        		id: gimbal_place.id.to_s,
        		attributes: {
        			name: gimbal_place.name
        		}
        	}
        end
    end
end
