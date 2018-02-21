## About

- It's a customized version of [google's go cloudbuiler](https://github.com/GoogleCloudPlatform/cloud-builders/tree/master/go) with the only distinction that it uses specific Go version.


## Delivery

The image is manually built in each project (rover-production|rover-staging) by executing the trigger manually (on a branch of your choice).
Once built it's used as a base image for other builds.

