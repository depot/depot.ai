import {type V2_MetaFunction} from '@remix-run/cloudflare'
import Example from '~/content/example.md'

export const meta: V2_MetaFunction = () => {
  return [
    {title: 'depot.ai | embed machine learning models in your Dockerfile'},
    {name: 'description', content: 'Embed machine learning models in your Dockerfile'},
  ]
}

interface Model {
  name: string
  sha: string
}

export default function Index() {
  const models: Model[] = []
  return (
    <div className="mx-auto my-16 max-w-3xl space-y-8 border border-radix-mauve6 rounded-xl p-8">
      <div className="flex items-baseline justify-between gap-4 leading-none border-b border-radix-mauve6 pb-8">
        <h1 className="text-6xl font-bold">
          depot.<span className="text-radix-grass11">ai</span>
        </h1>

        <a href="https://depot.dev" className="flex gap-1 items-center">
          <span className="text-radix-mauve11">Powered by</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="inline-block w-4 h-4"
          >
            <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
          <span className="font-bold">Depot</span>
        </a>
      </div>

      <div className="text-lg text-radix-mauve12 border-b border-radix-mauve6 pb-8">
        Embed machine learning models in your
        <code className="text-radix-amber11 bg-radix-amber3 p-1 rounded">Dockerfile</code>.
      </div>

      <h2 className="text-2xl font-semibold">Usage</h2>

      <div className="bg-radix-mauve1 -mx-8 p-8 text-sm border-y border-radix-mauve4">
        <Example />
      </div>

      <h2 className="text-2xl font-semibold">Models</h2>

      <div className="flex flex-col gap-4 flex-1">
        {models.map((model) => (
          <a
            href={`https://huggingface.co/${model.name}/tree/${model.sha}`}
            className="bg-radix-mauve1 border border-radix-mauve6 px-4 py-4 rounded-lg"
            target="_blank"
            rel="noreferrer"
          >
            <div className="tracking-tight">
              <span className="text-radix-mauve11">depot.ai/</span>
              {model.name}
              <span className="text-radix-mauve11">:latest</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
