import { makeError, PLUGIN_NAME } from '../lib/createReleaseManager'
import { PluginError } from 'gulp-util'

describe('makeError', () => {
  const error = makeError('awesome error')

  it('should be an instance of PluginError', () => {
    expect(error instanceof PluginError).toBe(true)
  })

  it('should be have correct plugin attribute name', () => {
    expect(error.plugin).toBe(PLUGIN_NAME)
  })

  it('should be have correct message', () => {
    expect(error.message).toBe('awesome error')
  })
})
