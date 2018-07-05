---
title: RoverExperiences
permalink: /ios/modules/experiences/
layout: module
secondary_navigation: ios
system_frameworks:
    - WebKit
dependencies:
    - name: RoverFoundation
      url: /ios/modules/foundation/
    - name: RoverData
      url: /ios/modules/data/
    - name: RoverUI
      url: /ios/modules/ui/
---

# RoverExperiences

The RoverExperiences module contains the <a href="{{ site.baseurl }}{% link ios/services/experience-store.md %}">ExperienceStore</a> service which is used to fetch and cache experiences from the server. In addition it includes the UI components for rendering experiences and the universal/deep link support to present them.

---

## Assembler

```swift
Rover.initialize(assemblers: [
    //...
    ExperiencesAssembler()
])
```

The `ExperiencesAssembler` doesn't take any parameters.

---

## Services

The following services are defined in the RoverExperiences module and are registered by the `ExperiencesAssembler`:

* <a href="{{ site.baseurl }}{% link ios/services/experience-store.md %}">ExperienceStore</a>
