let config = {
  cmsBasePath: process.env.REACT_APP_CMS_BASE_PATH || 'https://cms.coursemaker.io',
  apiBasePath: process.env.REACT_APP_API_BASE_PATH || 'https://api.coursemaker.io',
  reactAppMode: process.env.REACT_APP_MODE || 'dev',
}

export default config
