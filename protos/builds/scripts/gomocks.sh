#!/bin/sh

set -e

export PATH=/go/bin:$PATH

mkdir -p /go/bin
mkdir -p /go/src/github.com/golang
ln -s /go/src/github.com/roverplatform/rover/vendor/github.com/golang/mock /go/src/github.com/golang/
go build -o /go/bin/mockgen github.com/golang/mock/mockgen

cd $WORKDIR

# Audience Client Mock
mkdir -p apis/go/audience/v1/mock
mockgen  -package mock -destination apis/go/audience/v1/mock/mock.go github.com/roverplatform/rover/apis/go/audience/v1 AudienceClient

# Campaigns Client Mock
mkdir -p apis/go/campaigns/v1/mock
mockgen  -package mock -destination apis/go/campaigns/v1/mock/mock.go github.com/roverplatform/rover/apis/go/campaigns/v1 CampaignsClient

# Geocoder Client Mock
mkdir -p apis/go/geocoder/v1/mock
mockgen -package mock -destination apis/go/geocoder/v1/mock/mock.go github.com/roverplatform/rover/apis/go/geocoder/v1  GeocoderClient

# Notification Client Mock
mkdir -p apis/go/notification/v1/mock
mockgen -package mock -destination apis/go/notification/v1/mock/mock.go github.com/roverplatform/rover/apis/go/notification/v1  NotificationClient
