jest.mock('../lib/utils', () => ({
  makeError: jest.fn(value => value),
  toString: jest.fn(() => 'awesome-error')
}))
jest.mock('gulp-util')

import createHttpHandler from '../lib/createHttpHandler'
import { makeError, toString } from '../lib/utils'
import { HTTP_CONFLICT } from '../lib/constants'

describe('createHttpHandler', () => {
  it('should callback with an error', () => {
    const done = jest.fn()
    const handler = createHttpHandler(done, 'success!')
    handler('wtf', { statusCode: 400 })

    expect(done).toBeCalledWith('wtf')
    expect(makeError).toBeCalledWith('wtf')
  })

  it('should ignore errors when ignoreConflict = true ', () => {
    const done = jest.fn()
    const handler = createHttpHandler(done, 'success!', true)
    handler(null, { statusCode: HTTP_CONFLICT })

    expect(done).toBeCalledWith(null)
  })

  it('should raise an error when ignoreConflict = false', () => {
    const done = jest.fn()
    const handler = createHttpHandler(done, 'success!', false)
    handler(null, { statusCode: HTTP_CONFLICT }, 'body-content')

    expect(done).toBeCalledWith('awesome-error')
    expect(toString).toBeCalledWith(HTTP_CONFLICT, 'body-content')
    expect(makeError).toBeCalledWith('awesome-error')
  })

  it('should raise an error when statusCode != 2xx', () => {
    const done = jest.fn()
    const handler = createHttpHandler(done, 'success!')
    const errorCodes = [401, 403, 302]
    errorCodes.forEach(
      statusCode => {
        handler(null, { statusCode }, 'body-content')
        expect(done).toBeCalledWith('awesome-error')
        expect(toString).toBeCalledWith(statusCode, 'body-content')
        expect(makeError).toBeCalledWith('awesome-error')
      }
    )
  })

  it('should be successful when statusCode = 2xx', () => {
    const done = jest.fn()
    const handler = createHttpHandler(done, 'success!')
    const successfulCodes = [201, 209, 200]
    successfulCodes.forEach(
      statusCode => {
        handler(null, { statusCode }, 'body-content')
        expect(done).toBeCalledWith(null)
      }
    )
  })

  it('should raise an INTERNAL_SERVER_ERRORS error when statusCode = 5xx', () => {
    const done = jest.fn()
    const handler = createHttpHandler(done, 'success!')
    const errorCodes = [501, 502, 503, 504]
    errorCodes.forEach(
      statusCode => {
        handler(null, { statusCode }, 'body-content')
        expect(done).toBeCalledWith('INTERNAL_SERVER_ERRORS')
        expect(makeError).toBeCalledWith('INTERNAL_SERVER_ERRORS')
      }
    )
  })
})
