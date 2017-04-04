import { PLUGIN_NAME, REQUIRED_OPTIONS } from './constants'
import { PluginError } from 'gulp-util'

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

const toString = (statusCode, jsonBody) => {
  let body
  try {
    body = JSON.stringify(jsonBody)
  } catch (e) {
    body = jsonBody
  }

  return `[${statusCode}] ${body}`
}

export {
  makeError,
  validateRequired,
  isOptionRequired,
  validateOptions,
  toString
}
