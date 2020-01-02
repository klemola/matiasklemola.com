import fs from 'fs'
import { String, Record, Static } from 'runtypes'

const Config = Record({
  siteName: String,
  siteUrl: String,
  contentPath: String
})

// this is equivalent to the "Config" interface from before
type Config = Static<typeof Config>

try {
  const configFile = fs.readFileSync('./config.json', 'utf-8')
  const config: Config = JSON.parse(configFile)

  // The important bit
  Config.check(config)

  console.info(`🚧 Generating "${config.siteName}"`)

  const pages = fs.readdirSync(config.contentPath)
  // do something with the pages ...

  console.info('✅ Done')
} catch (e) {
  console.error('Something went wrong!', e)
}
