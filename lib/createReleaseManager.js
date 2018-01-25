import through from 'through2'
import request from 'request'

import { DEFAULT_OPTIONS } from './constants'
import { validateOptions } from './utils'
import makeRequestParams from './makeRequestParams'
import createHttpHandler from './createHttpHandler'
import makeRetryFn from './makeRetryFn'
import makeProcessFile from './makeProcessFile'

export default function createReleaseManager(options = {}) {
  const extendedOptions = { ...DEFAULT_OPTIONS, ...options }
  validateOptions(extendedOptions)

  const {
    host,
    org,
    project,
    apiKey,
    version,
    ignoreConflict,
    maxRetries,
    sourceMapBasePath
  } = extendedOptions
  const requestParams = makeRequestParams({
    host,
    org,
    project,
    apiKey,
    version
  })

  const create = done => {
    request.post(
      requestParams('/', {
        body: { version }
      }),
      createHttpHandler(
        done,
        `Created version '${version}' successfully!`,
        ignoreConflict
      )
    )
  }

  const remove = done => {
    request.del(
      requestParams(`/${version}/`),
      createHttpHandler(
        done,
        `Deleted version '${version}' successfully!`,
        ignoreConflict
      )
    )
  }

  const uploadFile = ({ contents: value, relative: filename }, done) => {
    request.post(
      requestParams(`/${version}/files/`, {
        formData: {
          file: {
            value,
            options: { filename }
          },
          name: sourceMapBasePath + filename
        }
      }),
      createHttpHandler(
        done,
        `Uploaded file '${filename}' successfully!`,
        ignoreConflict
      )
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
