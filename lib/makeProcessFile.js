import { makeError } from './utils'

const makeProcessFile = upload => function(file, encoding, callback) {
  if (file.isNull()) { // nothing to do
      return callback(null, file)
  }

  if (file.isStream()) {
      return this.emit('error', makeError('Streams not supported!'))
  }

  upload(file, callback)
}

export default makeProcessFile
