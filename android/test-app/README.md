## Rover Android SDK Engineering Test App

For internal use only, for the time being.

This app directly references the [SDK 2.0
project](https://github.com/RoverPlatform/rover-android/tree/2.0) library,
giving the developer a test-bed app to work with.

### Set up

Rather than depending on the built version of the Rover SDK library from a maven
repo like a typical customer app would do, for ease of library development this
project instead references a checkout of the library in a sibling directory by
means of a relative path.

1. Clone the SDK library itself:

       $ git clone -b 2.0 git@github.com:RoverPlatform/rover-android 

   NB. Be sure to leave the directory name as `rover-android`!

2. And then clone this project, the engineering test app, as a sibling directory:

       $ git clone git@github.com:RoverPlatform/rover-android-test-app


### Running the Library's specs within this project

Create a JUnit run configuration as normal (All in package, etc.), however, be
sure to set 'Use classpath of module: ' to the `rover` module.