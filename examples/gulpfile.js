const gulp = require('gulp')
const createReleaseManager = require('../dist/index')

const countries = ['ph']

countries.map(country => {
  const releaseManager = createReleaseManager({
    org: 'zalora',
    project: `lite`,
    apiKey: 'xxx',
    version: '0.0.1',
    host: 'https://sentry.prod.zalora.io',
    sourceMapBasePath: 'https://lite.com/sg/0.0.1/'
  })

  gulp.task(`create-release-${country}`, releaseManager.create)

  gulp.task(`remove-release-${country}`, releaseManager.remove)

  gulp.task(`upload-${country}`, function() {
    gulp.src('source-maps/*.map')
      .pipe(releaseManager.upload())
  })
})

gulp.task('default', ['create-release-ph'])
