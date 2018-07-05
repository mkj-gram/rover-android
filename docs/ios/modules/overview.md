---
title: Modules
permalink: /ios/modules/
layout: guide
secondary_navigation: ios
---

# Overview

The Rover SDK is broken up into separate modules. Each module contains an Assembler (described below) and a collection of <a href="{{ site.baseurl }}{% link ios/services/overview.md %}">Services</a>. A module may also contain models and UI components.

---

## Module Dependencies

Rover modules depend on one or more system frameworks such as UIKit or CoreLocation. In addition to system frameworks, each module may depend on other Rover modules.

<p class="read-more">
    {% include icons/book.svg %}
    The list of dependencies for each module is listed in the sidebar of the module's detail page.
</p>

---

## Assemblers

Each Rover module comes with an assembler. Before you can use a module in your app you need to pass its assembler to the `Rover.initialize` method when you initialize the Rover SDK. Below is an example of initializing the Rover SDK with the RoverFoundation module.

```swift
Rover.initialize(assemblers: [
    FoundationAssembler()
])
```

The `Rover.initialize` method instantiates the shared Rover instance and gives each assembler the opportunity to register services to it. After a service has been registered it can be accessed through the `Rover.shared.resolve` method. Below is an example of resolving the <a href="{{ site.baseurl }}{% link ios/services/logger.md %}">Logger</a> service&mdash;defined in the RoverFoundation module&mdash;and calling its `debug(_:)` method:

```swift
Rover.shared?.resolve(Logger.self)?.debug("Hello world!")
```

If you attempt to resolve a service defined in a module whose assembler was not included when calling `Rover.initialize`, the `Rover.shared.resolve` method will return `nil`.

<p class="read-more">
    {% include icons/book.svg %}
    A list of all the services in each module is included on the detail page for each module.
</p>

---

## Module Configuration

Each module's assembler accepts a set of arguments that can be used to customize its behavior. Below is an example of customizing the RoverFoundation assembler to use a more verbose logging strategy.

```swift
Rover.initialize(assemblers: [
    FoundationAssembler(loggerThreshold: .debug)
])
```

<p class="read-more">
    {% include icons/book.svg %}
    Details on the customization options for each assembler are listed on each module's detail page.
</p>
