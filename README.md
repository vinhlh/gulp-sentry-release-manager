# gulp-sentry-release-manager [![Build status](https://travis-ci.org/vinhlh/gulp-sentry-release-manager.svg?branch=master)](https://travis-ci.org/vinhlh/gulp-sentry-release-manager) [![Code Climate](https://codeclimate.com/github/vinhlh/gulp-sentry-release-manager/badges/gpa.svg)](https://codeclimate.com/github/vinhlh/gulp-sentry-release-manager) [![Test Coverage](https://codeclimate.com/github/vinhlh/gulp-sentry-release-manager/badges/coverage.svg)](https://codeclimate.com/github/vinhlh/gulp-sentry-release-manager/coverage)

## Usage

```js
const gulp = require('gulp')
const createReleaseManager = require('gulp-sentry-release-manager')

const countries = ['ph']

countries.map(country => {
  const releaseManager = createReleaseManager({
    org: 'awesome',
    project: `project-${country}`,
    apiKey: 'xxx',
    version: '0.0.1',
    host: 'https://sentry.awesome.io'
  })

  gulp.task(`create-release-${country}`, releaseManager.create)

  gulp.task(`remove-release-${country}`, releaseManager.remove)

  gulp.task(`upload-${country}`, function() {
    // `base` is important, is relative to your CDN URL
    gulp.src('static/js/*.map', { base: 'static/' })
      .pipe(releaseManager.upload())
  })
})

gulp.task('default', ['create-release-ph'])
```

## Options

- `host` - host name of Sentry servers. Default = `https://sentry.io`.
- `org` - organization slug (required)
- `project` - project slug (required)
- `apiKey` - api key with `project:releases` permission (required)
- `version` - version need to be deployed (required)
- `ignoreConflict` - ignore already exist errors. Default = `true`.
- `maxRetries` - the number of retries when having a failure. Default = `5`.
- `sourceMapBasePath` - The base path of source maps. Default is `~/`.

## APIs

- `releaseManager.create` - create the release.
- `releaseManager.remove` - remove the release.
- `releaseManager.upload` - upload source maps to the release.
