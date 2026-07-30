import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
if (!OPENROUTER_API_KEY) {
  throw new Error('OPENROUTER_API_KEY is not set in .env')
}

const prompt = process.argv[2]
const model = process.argv[3] ?? 'google/veo-3.1'

if (!prompt) {
  console.error('Usage: npm run test-video -- "<prompt>" [model]')
  process.exit(1)
}

const headers = {
  Authorization: `Bearer ${OPENROUTER_API_KEY}`,
  'Content-Type': 'application/json',
}

const POLL_INTERVAL_MS = 10_000

const submitResponse = await fetch('https://openrouter.ai/api/v1/videos', {
  method: 'POST',
  headers,
  body: JSON.stringify({ model, prompt, duration: 4 }),
})

if (!submitResponse.ok) {
  throw new Error(`Submit failed: ${submitResponse.status} ${await submitResponse.text()}`)
}

const submitResult = await submitResponse.json()
const jobId = submitResult.id
const pollingUrl = submitResult.polling_url
console.log(`Job submitted: ${jobId}`)
console.log(`Status: ${submitResult.status}`)

let status
while (true) {
  await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))

  const pollResponse = await fetch(pollingUrl, { headers })
  if (!pollResponse.ok) {
    throw new Error(`Poll failed: ${pollResponse.status} ${await pollResponse.text()}`)
  }

  status = await pollResponse.json()
  console.log(`Status: ${status.status}`)

  if (status.status === 'completed') break
  if (status.status === 'failed') {
    throw new Error(`Generation failed: ${status.error ?? 'Unknown error'}`)
  }
}

const contentUrl = status.unsigned_urls[0]
const videoResponse = await fetch(contentUrl)
if (!videoResponse.ok) {
  throw new Error(`Download failed: ${videoResponse.status}`)
}
const videoBuffer = Buffer.from(await videoResponse.arrayBuffer())

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outputDir = path.join(__dirname, 'output')
fs.mkdirSync(outputDir, { recursive: true })

const outputPath = path.join(outputDir, `${jobId}.mp4`)
fs.writeFileSync(outputPath, videoBuffer)

console.log(`Video saved to ${outputPath}`)
