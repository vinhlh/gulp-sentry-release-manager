const makeRequestParams = (apiOptions) => {
  const { host, org, project, apiKey } = apiOptions
  return (path = '/', dataOptions = {}) => {
    const { body, formData } = dataOptions
    return {
      url: `${host}/api/0/projects/${org}/${project}/releases${path}`,
      json: true,
      auth: { bearer: apiKey },
      body,
      formData
    }
  }
}

export default makeRequestParams
