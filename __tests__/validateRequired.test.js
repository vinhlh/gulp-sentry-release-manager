import { validateRequired } from '../lib/createReleaseManager'

describe('validateRequired', () => {
  it('should throws an error', () => {
    [
      undefined,
      null,
      ''
    ].forEach(
      value => expect(() => validateRequired('project', value))
        .toThrowError('Option \'project\' is required')
    )
  })

  it('should not throws any error', () => {
    [
      'awesome',
      888
    ].forEach(
      value => expect(() => validateRequired('project', value)).not.toThrow()
    )
  })
})
