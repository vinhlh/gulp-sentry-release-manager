import { PluginError, log } from 'gulp-util'

import {
  INTERNAL_SERVER_ERRORS,
  RETRY_TIMEOUTS
} from './constants'

const makeRetryFn = (fn, maxRetries) => (file, done) => {
  let retries = -1
  const retryHandler = errorStatus => {
    if (errorStatus instanceof PluginError && errorStatus.message === INTERNAL_SERVER_ERRORS) {
      if (retries >= maxRetries - 1) {
        return done(errorStatus)
      }

      retries++
      const timeout = RETRY_TIMEOUTS[retries] || RETRY_TIMEOUTS[RETRY_TIMEOUTS.length - 1]
      log(`Will retry after ${timeout}ms`)
      return setTimeout(() => fn(file, retryHandler), timeout)
    }

    done(errorStatus)
  }

  fn(file, retryHandler)
}

export default makeRetryFn
