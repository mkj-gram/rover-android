---
title: RoverBluetooth
permalink: /ios/modules/bluetooth/
layout: module
secondary_navigation: ios
system_frameworks:
    - CoreBluetooth
dependencies:
    - name: RoverFoundation
      url: /ios/modules/foundation/
    - name: RoverData
      url: /ios/modules/data/
---

# RoverBluetooth

The RoverBluetooth module tracks events when the user enables or disables Bluetooth on their device and adds `isBluetoothEnabled` to each event that is tracked through the <a href="{{ site.baseurl }}{% link ios/services/event-queue.md %}">`EventQueue`</a>.

---

## Assembler

```swift
Rover.initialize(assemblers: [
    //...
    BluetoothAssembler()
])
```

The `BluetoothAssembler` doesn't take any parameters.

---

## Services

The following services are defined in the RoverBluetooth module and are registered by the `BluetoothAssembler`:

* <a href="{{ site.baseurl }}{% link ios/services/bluetooth-manager.md %}">BluetoothManager</a>
