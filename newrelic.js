'use strict'

/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * Array of application names.
   */
  app_name: ['SDK-API'],
  /**
   * Your New Relic license key.
   */
  license_key: 'c730823243f81798bf0c0a8991cbef71478a21dc',
  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level: 'info'
  },
  transaction_tracer: {
    enabled: true,
    apdex_f: 100
  }
}
