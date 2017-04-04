import { log } from 'gulp-util'

import { HTTP_CONFLICT, INTERNAL_SERVER_ERRORS } from './constants'
import { makeError, toString } from './utils'

const createHttpHandler = (done, successMsg, ignoreConflict = true) => (error, response, body) => {
  if (error) {
    return done(makeError(error))
  }

  const { statusCode } = response
  if (ignoreConflict && statusCode === HTTP_CONFLICT) {
    log(toString(statusCode, body))
    return done(null)
  }

  if (statusCode >= 500 && statusCode <= 599) { // internal error codes
    return done(makeError(INTERNAL_SERVER_ERRORS))
  }

  if (statusCode < 200 || statusCode > 299) { // not success codes
    return done(makeError(toString(statusCode, body)))
  }

  log(toString(statusCode, successMsg))
  done(null)
}

export default createHttpHandler
