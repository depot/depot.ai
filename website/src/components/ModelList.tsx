import Fuse from 'fuse.js'
import {useCallback, useEffect, useMemo, useState} from 'react'
import {Model, type ModelProps} from './Model'
import {CrossIcon} from './icons'

export interface ModelListProps {
  models: ModelProps[]
}

export function ModelList({models}: ModelListProps) {
  const fuse = useMemo(() => new Fuse(models, {keys: ['name'], threshold: 0.5}), [models])
  const [filter, setFilter] = useState('')
  const [filteredModels, setFilteredModels] = useState(models)

  useEffect(() => {
    if (filter === '') {
      setFilteredModels(models)
    } else {
      const filterString = filter.toLowerCase()
      const results = fuse.search(filterString)
      setFilteredModels(results.map((result) => result.item))
    }
  }, [filter, models])

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value)
  }, [])

  const resetFilter = useCallback(() => {
    setFilter('')
  }, [])

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        resetFilter()
      }
    },
    [resetFilter],
  )

  return (
    <div className="flex flex-col gap-4 flex-1">
      <div className="relative">
        <input
          type="text"
          className="bg-radix-mauve3 w-full border border-radix-mauve7 ring-radix-blue9 rounded-lg hover:border-radix-mauve8"
          placeholder="Type to filter models by name..."
          value={filter}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
        {filter !== '' && (
          <button type="button" className="absolute right-2 top-2 leading-none mt-px" onClick={resetFilter}>
            <CrossIcon className="hover:text-radix-mauve12 text-radix-mauve11 w-6 h-6" />
          </button>
        )}
      </div>
      {filteredModels.map((model) => (
        <Model key={model.name} name={model.name} sha={model.sha} tagAs={model.tagAs} />
      ))}
    </div>
  )
}
