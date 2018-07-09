---
title: Installation and Initialization
permalink: /ios/
layout: guide
secondary_navigation: ios
tertiary_navigation:
  - name: Install the SDK
    anchor: install-the-sdk
  - name: Initialization
    anchor: initialization
---

# Installation and Initialization

The Rover SDK is a collection of Cocoa Touch Frameworks written in Swift. Instead of a single monolithic framework, the Rover SDK takes a modular approach, allowing you to include only the functionality relevant to your application. The SDK is 100% open-source and available on [GitHub](https://github.com/RoverPlatform/rover-ios).

---

## Install the SDK

The recommended way to install the Rover SDK is via [Cocoapods](http://cocoapods.org/).

The Rover [Podspec](https://guides.cocoapods.org/syntax/podspec.html) breaks each of the Rover frameworks out into a separate [Subspec](https://guides.cocoapods.org/syntax/podspec.html#group_subspecs). 

The simplest approach is to specify `Rover` as a dependency of your app's target which will add all required and optional subspecs to your project. 

```ruby
target 'MyAppTarget' do
  pod 'Rover', '~> 2.0.0-beta.1'
end
```

Alternatively you can specify the exact set of subspecs you want to include. 

```ruby
target 'MyAppTarget' do
    pod 'Rover/Foundation',    '~> 2.0.0-beta.1'
    pod 'Rover/Data',          '~> 2.0.0-beta.1'
    pod 'Rover/UI',            '~> 2.0.0-beta.1'
    pod 'Rover/Experiences',   '~> 2.0.0-beta.1'
    pod 'Rover/Notifications', '~> 2.0.0-beta.1'
    pod 'Rover/Location',      '~> 2.0.0-beta.1'
    pod 'Rover/Bluetooth',     '~> 2.0.0-beta.1'
    pod 'Rover/Debug',         '~> 2.0.0-beta.1'
end
```

There are various reasons why you may not want to include all the Rover frameworks in your project. For example, you may wish to omit the `RoverBluetooth` module to avoid your application having a dependency on [CoreBluetooth](https://developer.apple.com/documentation/corebluetooth?changes=_5).

<p class="read-more">
    {% include icons/book.svg %}
    Each of the modules&mdash;including their dependent system frameworks&mdash; is described in the <a href="{{ site.baseurl }}{% link ios/modules/overview.md %}">Modules</a> section.
</p>

Cocoapods will compile all the subspecs you've included into a single framework named `Rover`. This means anywhere you want to use functionality from the Rover SDK you only need a single important statement, regardless of the module the functionality is defined in.

```swift
import Rover
```

### Carthage

CocoaPods is the simplest approach to installing the Rover SDK but you can also use [Carthage](https://github.com/Carthage/Carthage).

Add the following entry to your `Cartfile`:

```ruby
github "RoverPlatform/rover-ios" ~> 2.0.0-beta.1
```

When you run `carthage update` it will compile _all_ the Rover modules into individual frameworks and place them in your Carthage/Build directory but you do not have to add them all to your project. You can still select the specific frameworks that are relevant to your application and add them to your project via the normal Carthage procedure.

Because Carthage compiles individual frameworks you need to import the proper Rover module depending on the functionality you need. For example, to access the Rover `NotificationHandler` you need to import `RoverNotifications`. 

Documentation on how to use Carthage is available on their [GitHub repo](https://github.com/Carthage/Carthage).

---

## Initialization

The shared Rover instance is initialized with a set of assemblers. Each assembler has its own parameters but the only one that is required is the `accountToken` parameter on the `DataAssembler`.

```swift
Rover.initialize(assemblers: [
    FoundationAssembler(),
    DataAssembler(accountToken: "YOUR_SDK_TOKEN"),
    UIAssembler(),
    ExperiencesAssembler(),
    NotificationsAssembler(),
    LocationAssembler(),
    BluetoothAssembler(),
    DebugAssembler()
])
```

<p class="read-more">
    {% include icons/book.svg %}
    You can learn more about assemblers and their parameters in the <a href="{{ site.baseurl }}{% link ios/modules/overview.md %}">Modules</a> section.
</p>

You can get your SDK token from the Rover <a href="https://app.rover.io/settings">Settings app</a>. Find the token labelled "SDK Token" and click the icon next to it to copy it to your clipboard.

![Settings App]({{ "/assets/ios/installation-initialization/settings-app.jpg" | absolute_url }})

Replace `YOUR_SDK_TOKEN` in the above code sample with your actual SDK token.
