import {useEffect, useState} from 'react'
import {useCopyToClipboard} from '../hooks/useCopyToClipboard'

export interface ModelProps {
  name: string
  sha: string
}

export function Model({name, sha}: ModelProps) {
  const [copied, setCopied] = useState(false)
  const [value, copy] = useCopyToClipboard()
  useEffect(() => {
    if (!value) return () => {}
    setCopied(true)
    const timeout = setTimeout(() => {
      setCopied(false)
    }, 3000)
    return () => clearTimeout(timeout)
  }, [value])

  return (
    <div className="bg-radix-mauve1 border border-radix-mauve6 px-4 py-4 rounded-lg gap-2 flex items-center leading-none justify-between">
      <div className="tracking-tight text-lg cursor-pointer" onClick={() => copy(`depot.ai/${name}:latest`)}>
        <span className="text-radix-mauve11">depot.ai/</span>
        {name}
        <span className="text-radix-mauve11">:latest</span>
      </div>
      {copied && (
        <span className="text-radix-mauve11">
          <span className="animate-pulse-slow text-radix-grass11 text-sm">copied</span>
        </span>
      )}
      <div className="flex-1 text-right">
        <a
          href={`https://huggingface.co/${name}/tree/${sha}`}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-radix-mauve11"
        >
          Source
        </a>
      </div>
    </div>
  )
}
