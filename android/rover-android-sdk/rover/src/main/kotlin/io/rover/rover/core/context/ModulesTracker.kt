package io.rover.rover.core.context

class ModulesTracker: ModulesTrackerInterface {
    override fun version(moduleName: String, version: String) {
        registeredModules[moduleName] = version
    }

    override var registeredModules: MutableMap<String, String> = hashMapOf()
        private set
}
