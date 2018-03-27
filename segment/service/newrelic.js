'use strict'

/**
 * New Relic agent configuration.
 *
 * See lib/config.default.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * Array of application names.
   */
  app_name: ['Segment Service'],
  /**
   * Your New Relic license key.
   */
  license_key: 'c730823243f81798bf0c0a8991cbef71478a21dc',
  agent_enabled: process.env.NEW_RELIC_ENABLED === 'true',
  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level: 'info'
  }
}
