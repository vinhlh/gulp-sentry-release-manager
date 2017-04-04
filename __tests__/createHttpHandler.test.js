import { makeError, createHttpHandler } from '../lib/createReleaseManager'

describe('createHttpHandler', () => {
  it('should callback with an error', () => {
    const done = jest.fn()
    const handler = createHttpHandler(done, 'success!')
    handler('wtf', { statusCode: 400 })

    expect(done).toBeCalledWith(makeError('wtf'))
  })
})
