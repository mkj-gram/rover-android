WORKDIR=/go/src/github.com/roverplatform/rover
MOCKGEN="go run /go/src/github.com/roverplatform/rover/vendor/github.com/golang/mock/mockgen/*.go"

cd $WORKDIR

# Audience Client Mock
mkdir -p apis/go/audience/v1/mock
$MOCKGEN  -package mock -destination apis/go/audience/v1/mock/mock.go github.com/roverplatform/rover/apis/go/audience/v1 AudienceClient


# Campaigns Client Mock
mkdir -p apis/go/campaigns/v1/mock
$MOCKGEN  -package mock -destination apis/go/campaigns/v1/mock/mock.go github.com/roverplatform/rover/apis/go/campaigns/v1 CampaignsClient

# Geocoder Client Mock
mkdir -p apis/go/geocoder/v1/mock
$MOCKGEN -package mock -destination apis/go/geocoder/v1/mock/mock.go github.com/roverplatform/rover/apis/go/geocoder/v1  GeocoderClient