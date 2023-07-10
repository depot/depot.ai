import {SVGProps, useEffect, useState} from 'react'
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
      <div
        className="flex items-center cursor-pointer gap-3"
        onClick={() => copy(`COPY --link --from=depot.ai/${name}:latest / .`)}
      >
        <CopyIcon className="text-radix-mauve10" />
        <div className="tracking-tight text-lg">
          <span className="text-radix-mauve11">depot.ai/</span>
          {name}
          <span className="text-radix-mauve11">:latest</span>
        </div>
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

export function CopyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M7.024 3.75c0-.966.784-1.75 1.75-1.75H20.25c.966 0 1.75.784 1.75 1.75v11.498a1.75 1.75 0 0 1-1.75 1.75H8.774a1.75 1.75 0 0 1-1.75-1.75V3.75zm1.75-.25a.25.25 0 0 0-.25.25v11.498c0 .139.112.25.25.25H20.25a.25.25 0 0 0 .25-.25V3.75a.25.25 0 0 0-.25-.25H8.774z"
      ></path>
      <path
        fill="currentColor"
        d="M1.995 10.749a1.75 1.75 0 0 1 1.75-1.751H5.25a.75.75 0 1 1 0 1.5H3.745a.25.25 0 0 0-.25.25L3.5 20.25c0 .138.111.25.25.25h9.5a.25.25 0 0 0 .25-.25v-1.51a.75.75 0 1 1 1.5 0v1.51A1.75 1.75 0 0 1 13.25 22h-9.5A1.75 1.75 0 0 1 2 20.25l-.005-9.501z"
      ></path>
    </svg>
  )
}
