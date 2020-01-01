import fs from 'fs'

interface Config {
  siteName: string
  siteUrl: string
  contentPath: string
}

try {
  const configFile = fs.readFileSync('./config.json', 'utf-8')
  const config: Config = JSON.parse(configFile)

  console.info(`🚧 Generating "${config.siteName}"`)

  const pages = fs.readdirSync(config.contentPath)
  // do something with the pages ...

  console.info('✅ Done')
} catch (e) {
  console.error('Something went wrong!', e)
}
