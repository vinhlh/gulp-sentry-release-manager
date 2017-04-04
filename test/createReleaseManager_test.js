import { assert } from 'chai'
import { makeRequestParams } from '../lib/createReleaseManager'

describe('makeRequestParams', () => {
  const requestParams = makeRequestParams({
    host: 'https://sentry.zalora.io',
    org: 'zalora',
    project: 'awesome',
    apiKey: 'abcdef',
    version: '0.0.1'
  })

  it('should return correct params of release api', () => {
    assert(
      requestParams('/'),
      {
        url: 'https://sentry.zalora.io/api/0/projects/zalora/awesome/releases/',
        json: true,
        auth: {
          bearer: 'abcdef'
        },
        body: {},
        formData: {}
      }
    )
  })

  it('should return correct params of release files api', () => {
    assert(
      requestParams('/files/', { body: { trump: 'awesome' } }),
      {
        url: 'https://sentry.zalora.io/api/0/projects/zalora/awesome/releases/files/',
        json: true,
        auth: {
          bearer: 'abcdef'
        },
        body: {
          trump: 'awesome'
        },
        formData: {}
      }
    )
  })
})
