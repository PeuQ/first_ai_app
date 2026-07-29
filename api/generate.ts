import type { VercelRequest, VercelResponse } from '@vercel/node'

const PLACEHOLDER_VIDEO_URL =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt } = req.body ?? {}

  if (typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'prompt is required' })
  }

  // Placeholder: real video generation is not implemented yet.
  return res.status(200).json({ prompt, videoUrl: PLACEHOLDER_VIDEO_URL })
}
