const PLUGIN_NAME = 'gulp-sentry-release-manager'
const HTTP_CONFLICT = 409
const INTERNAL_SERVER_ERRORS = 'INTERNAL_SERVER_ERRORS'
const REQUIRED_OPTIONS = ['org', 'project', 'apiKey', 'version']
const RETRY_TIMEOUTS = [500, 1000, 1700, 2600, 3700, 5000]
const DEFAULT_OPTIONS = {
  host: 'https://sentry.io',
  ignoreConflict: true,
  maxRetries: 5
}

export {
  PLUGIN_NAME,
  HTTP_CONFLICT,
  INTERNAL_SERVER_ERRORS,
  REQUIRED_OPTIONS,
  RETRY_TIMEOUTS,
  DEFAULT_OPTIONS
}
