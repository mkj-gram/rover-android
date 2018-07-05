---
title: RoverFoundation
permalink: /ios/modules/foundation/
layout: module
secondary_navigation: ios
system_frameworks:
    - Foundation
---

# RoverFoundation

The RoverFoundation module contains common services, types and utilities used by the other Rover modules. The Rover dependency injection framework and the shared Rover instance are defined in the RoverFoundation module. Every other module depends on RoverFoundation.

---

## Assembler

```swift
Rover.initialize(assemblers: [
    FoundationAssembler(loggerThreshold: .debug)
])
```

### `loggerThreshold: LogLevel` 

(Optional) Defines the minimum level log that will be output to the console. For example, a `loggerThreshold` value of `.warn` will display warning and error messages but omit debug messages. A value of `.error` will only display error messages. If the `loggerThreshold` parameter is omitted, the default value of `.warn` will be used.



---

## Services

The following services are defined in the RoverFoundation module and are registered by the `FoundationAssembler`:

* <a href="{{ site.baseurl }}{% link ios/services/dispatcher.md %}">Dispatcher</a>
* <a href="{{ site.baseurl }}{% link ios/services/logger.md %}">Logger</a>