---
title: RoverLocation
permalink: /ios/modules/location/
layout: module
secondary_navigation: ios
system_frameworks:
    - CoreLocation
    - UIKit
dependencies:
    - name: RoverFoundation
      url: /ios/modules/foundation/
    - name: RoverData
      url: /ios/modules/data/
---

# RoverLocation

The RoverLocation module is a wrapper around a [`CLLocationManager`](https://developer.apple.com/documentation/corelocation/cllocationmanager) that provides functionality for automatically tracking location-related events and maintaining the `CLLocationManager`'s list of monitored regions.

---

## Assembler

```swift
Rover.initialize(assemblers: [
    //...
    LocationAssembler(isAutomaticLocationEventTrackingEnabled: true,
        isAutomaticRegionManagementEnabled: true,
        isSignificantLocationMonitoringEnabled: true)
])
```

### `isAutomaticLocationEventTrackingEnabled: Bool` 

(Optional) When `isAutomaticLocationEventTrackingEnabled` is `true` the RoverLocation module will automatically track events for region enter/exits, visits and background location updates. The default value is `true`.

### `isAutomaticRegionManagementEnabled: Bool`

(Optional) When `isAutomaticRegionManagementEnabled` is `true` the RoverLocation module will fetch a list of regions to monitor whenever a state fetch is performed. The result of the fetch is used to manage the [`CLLocationManager`](https://developer.apple.com/documentation/corelocation/cllocationmanager)'s set of [`monitoredRegions`](https://developer.apple.com/documentation/corelocation/cllocationmanager). This effectively gives the Rover platform control over which regions a device should be monitoring at any given time. The default value is `true`.

### `isSignificantLocationMonitoringEnabled: Bool`

(Optional) The `isSignificantLocationMonitoringEnabled` determines whether [`startMonitoringSignificantLocationChanges`](https://developer.apple.com/documentation/corelocation/cllocationmanager/1423531-startmonitoringsignificantlocati) should be called on the [`CLLocationManager`](https://developer.apple.com/documentation/corelocation/cllocationmanager). The default value is `true`.

---

## Services

The following services are defined in the RoverLocation module and are registered by the `LocationAssembler`:

* <a href="{{ site.baseurl }}{% link ios/services/location-manager.md %}">LocationManager</a>
* <a href="{{ site.baseurl }}{% link ios/services/region-store.md %}">RegionStore</a>
