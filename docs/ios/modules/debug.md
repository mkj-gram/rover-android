---
title: RoverDebug
permalink: /ios/modules/debug/
layout: module
secondary_navigation: ios
system_frameworks:
    - UIKit
dependencies:
    - RoverFoundation
    - RoverData
    - RoverUI
---

# RoverDebug

The RoverDebug module adds a new `isTestDevice` boolean to each event that is tracked through the <a href="{{ site.baseurl }}{% link ios/services/event-queue.md %}">`EventQueue`</a> and provides a view controller for managing its value.

---

## Assembler

```swift
Rover.initialize(assemblers: [
    //...
    DebugAssembler()
])
```

The `DebugAssembler` doesn't take any parameters.

---

## Services

The following services are defined in the RoverDebug module and are registered by the `DebugAssembler`:

* <a href="{{ site.baseurl }}{% link ios/services/test-device-manager.md %}">TestDeviceManager</a>
