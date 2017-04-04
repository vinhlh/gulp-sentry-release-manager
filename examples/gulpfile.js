const gulp = require('gulp')
const createReleaseManager = require('../dist/index')

const countries = ['ph']

countries.map(country => {
  const releaseManager = createReleaseManager({
    org: 'awesome',
    project: `project-${country}`,
    apiKey: 'xxx',
    version: '0.0.1',
    host: 'https://awesome.zalora.io'
  })

  gulp.task(`create-release-${country}`, releaseManager.create)

  gulp.task(`remove-release-${country}`, releaseManager.remove)

  gulp.task(`upload-${country}`, function() {
    gulp.src('source-maps/*.map')
      .pipe(releaseManager.upload())
  })
})

gulp.task('default', ['create-release-ph'])
