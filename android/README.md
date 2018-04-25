# Rover Android

This is the top-level mono-project that contains the Rover Android projects,
including the SDK itself. A single Gradle/IntelliJ project contains the lot.
However, the SDK itself is a bit of a special case: as it is an open source
project exposed to the world, it is a separate git repository that is mounted
into the monorepo as a submodule.

Note that this is strictly for SDK 2.x. Nothing to support 1.x is contained
here.

### Components

The Rover Android SDK itself: `rover-android-sdk`, the submodule.

The Engineering Test App(s): `test-app`, `test-app-gcm`, and `test-app-java`.
Meant for engineering-only use to validate certain developer user cases or
provide a test bench for Rover developers to work in.

The Experiences App: `experiences-app`. 

### Set up

1. Set up and retrieve the submodule:

       $ git submodule init
       $ git submodule update

2. Ensure that the SDK has its shaded (ie., vendored) dependencies fetched:

       $ cd rover-android-sdk
       $ ./shade_external_libraries.sh

2. Then open this mono directory (`andorid`) as a Gradle Android project in the
   latest Android Studio.