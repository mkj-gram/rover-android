package io.rover.rover.core.context

interface ModulesTrackerInterface {
    /**
     * Each of the assemblers for each of the respective Rover modules (core, experiences, location,
     * etc.).
     */
    fun version(moduleName: String, version: String)

    /**
     * Return a map of all the registered Rover modules and their version numbers.
     */
    val registeredModules: Map<String, String>
}
