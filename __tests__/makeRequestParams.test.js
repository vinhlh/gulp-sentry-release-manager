import makeRequestParams from '../lib/makeRequestParams'

describe('makeRequestParams', () => {
  const requestParams = makeRequestParams({
    host: 'https://sentry.zalora.io',
    org: 'zalora',
    project: 'awesome',
    apiKey: 'abcdef',
    version: '0.0.1'
  })

  it('should return correct params of release api', () => {
    expect(requestParams('/')).toMatchObject({
      url: 'https://sentry.zalora.io/api/0/projects/zalora/awesome/releases/',
      json: true,
      auth: {
        bearer: 'abcdef'
      },
      body: undefined,
      formData: undefined
    })
  })

  it('should return correct params of release files api', () => {
    expect(requestParams('/files/', { body: { trump: 'awesome' } })).toMatchObject({
      url: 'https://sentry.zalora.io/api/0/projects/zalora/awesome/releases/files/',
      json: true,
      auth: {
        bearer: 'abcdef'
      },
      body: {
        trump: 'awesome'
      },
      formData: undefined
    })
  })
})
