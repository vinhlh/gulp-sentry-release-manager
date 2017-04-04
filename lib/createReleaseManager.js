import through from 'through2'
import { PluginError, log } from 'gulp-util'
import request from 'request'

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

const makeRequestParams = (apiOptions) => {
  const { host, org, project, apiKey } = apiOptions
  return (path = '/', dataOptions = {}) => {
    const { body, formData } = dataOptions
    return {
      url: `${host}/api/0/projects/${org}/${project}/releases${path}`,
      json: true,
      auth: { bearer: apiKey },
      body,
      formData
    }
  }
}

const makeError = msg => new PluginError(PLUGIN_NAME, msg)

const validateRequired = (option, value) => {
  if (!value) {
    throw makeError(`Option '${option}' is required!`)
  }
}

const isOptionRequired = option =>
  REQUIRED_OPTIONS.indexOf(option) !== -1

const validateOptions = options =>
  Object.keys(options)
    .filter(isOptionRequired)
    .forEach(key => validateRequired(key, options[key]))

const makeProcessFile = upload => function(file, encoding, callback) {
  if (file.isNull()) { // nothing to do
      return callback(null, file)
  }

  if (file.isStream()) {
      return this.emit('error', makeError('Streams not supported!'))
  }

  upload(file, callback)
}

const toString = (statusCode, jsonBody) => {
  let body
  try {
    body = JSON.stringify(jsonBody)
  } catch (e) {
    body = jsonBody
  }

  return `[${statusCode}] ${body}`
}

const createHttpHandler = (done, successMsg, ignoreConflict = true) => (error, response, body) => {
  if (error) {
    return done(makeError(error))
  }

  const { statusCode } = response
  if (ignoreConflict && statusCode === HTTP_CONFLICT) {
    log(toString(statusCode, body))
    return done(null)
  }

  if (statusCode >= 500 && statusCode >= 599) { // internal error codes
    return done(makeError(INTERNAL_SERVER_ERRORS))
  }

  if (statusCode < 200 || statusCode > 299) { // success codes
    return done(makeError(toString(statusCode, body)))
  }

  log(toString(statusCode, successMsg))
  done(null)
}

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

export default function createReleaseManager(options = {}) {
  const extendedOptions = { ...DEFAULT_OPTIONS, ...options }
  validateOptions(extendedOptions)

  const { host, org, project, apiKey, version, ignoreConflict, maxRetries } = extendedOptions
  const requestParams = makeRequestParams({ host, org, project, apiKey, version })

  const create = done => {
    request.post(
      requestParams('/', {
        body: { version }
      }),
      createHttpHandler(done, `Created version '${version}' successfully!`, ignoreConflict)
    )
  }

  const remove = done => {
    request.del(
      requestParams(`/${version}/`),
      createHttpHandler(done, `Deleted version '${version}' successfully!`, ignoreConflict)
    )
  }

  const uploadFile = ({ contents: value, relative: filename }, done) => {
    request.post(
      requestParams(`/${version}/files/`, {
        formData: {
          file: {
            value,
            options: { filename }
          }
        }
      }),
      createHttpHandler(done, `Uploaded file '${filename}' successfully!`, ignoreConflict)
    )
  }

  const uploadFileWithRetries = makeRetryFn(uploadFile, maxRetries)

  const upload = () => through.obj(makeProcessFile(uploadFileWithRetries))

  return {
    create,
    remove,
    upload
  }
}

export {
  PLUGIN_NAME,
  makeRequestParams,
  makeError,
  validateRequired,
  isOptionRequired,
  validateOptions,
  makeProcessFile,
  toString,
  createHttpHandler,
  makeRetryFn
}
