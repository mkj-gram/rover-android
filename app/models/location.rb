class Location < ActiveRecord::Base
	# adds callbacks to replicate
	include ModelBroadcaster::Document

end
