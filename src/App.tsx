import { useState, type FormEvent } from 'react'

const FALLBACK_VIDEO_URL =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

function App() {
  const [prompt, setPrompt] = useState('')
  const [videoUrl, setVideoUrl] = useState(FALLBACK_VIDEO_URL)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!prompt.trim()) {
      setError('Please enter a prompt.')
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const data: { videoUrl: string } = await response.json()
      setVideoUrl(data.videoUrl)
    } catch {
      setError('Something went wrong generating your video. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 p-4 text-neutral-100">
      <div className="w-full max-w-lg space-y-6 rounded-2xl bg-neutral-900 p-8 shadow-xl">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold">AI Video Generator</h1>
          <p className="text-sm text-neutral-400">
            Describe a video and generate a 4-second clip.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="A dog surfing on a rainbow wave"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm outline-none focus:border-neutral-400"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Generating…' : 'Generate video'}
          </button>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </form>

        <video
          key={videoUrl}
          src={videoUrl}
          controls
          className="w-full rounded-lg"
        />
      </div>
    </div>
  )
}

export default App
