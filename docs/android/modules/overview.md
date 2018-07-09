---
title: Modules
permalink: /android/modules/
layout: guide
secondary_navigation: android
---

# Overview

The Rover SDK is broken up into separate modules. Each module contains an
Assembler (described below) and a collection of <a href="{{ site.baseurl }}{%
link android/services/overview.md %}">Services</a>. A module may also contain
models and UI components.

---

## Assemblers

Each Rover module comes with an assembler. Before you can use a module in your
app you need to pass its assembler to the `Rover.initialize` method when you
initialize the Rover SDK. Below is an example of initializing the Rover SDK with
just the Core module.

```kotlin
Rover.initialize(
    CoreAssembler(…)
)
```

The `Rover.initialize` method instantiates the shared Rover instance and gives
each assembler the opportunity to register services to it. After a service has
been registered it can be accessed through the
`Rover.sharedInstance.resolve` method. Below is an example of
resolving the <a href="{{ site.baseurl }}{% link ios/services/logger.md
%}">Logger</a> service&mdash;defined in the Core module&mdash;and
calling its `d()` method:

```kotlin
Rover.sharedInstance.resolve(LogReceiver::class.java)?.d("Hello world!")
```

If you attempt to resolve a service defined in a module whose assembler was not
included when calling `Rover.initialize`, the `Rover.sharedInstance.resolve`
method will return `null`.

<aside class="advanced">
You may also use <code>Rover.sharedInstance.resolveSingletonOrFail()</code>
instead of <code>resolve()</code> to have it fail immediately with a verbose
error message if the service you are requesting has not been registered rather
than returning <code>null</code>.
</aside>

<p class="read-more">
    {% include icons/book.svg %}
    A list of all the services in each module is included on the detail page for each module.
</p>

---

## Module Configuration

Each module's assembler accepts a set of arguments that can be used to customize
its behavior. Below is an example of customizing the core assembler
to use a more verbose logging strategy.

```kotlin
Rover.initialize(
    CoreAssembler(
        chromeTabBackgroundColor = Color.RED
    )
)
```

<p class="read-more">
    {% include icons/book.svg %}
    Details on the customization options for each assembler are listed on each module's detail page.
</p>
