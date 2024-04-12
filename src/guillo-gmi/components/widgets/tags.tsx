import { Select } from '../input/select'
import { Tag } from '../ui/tag'
import { Loading } from '../ui/loading'
import { useRef, useState } from 'react'

const prepareAvailable = (
  items: {
    value: string
    text: string
  }[],
  already: string[],
  title: string
) => {
  const def = { value: '', text: `Add ${title}` }
  if (items.length === 0) return []
  return [def].concat(items).filter((item) => !already.includes(item.value))
}

interface Props {
  items: string[]
  available?: {
    value: string
    text: string
  }[]
  title: string
  noData: string
  onChange: (items: string[]) => void
  loading?: boolean
}
export function TagsWidget({
  items,
  available,
  title,
  noData,
  onChange,
  loading,
}: Props) {
  const selectRef = useRef<HTMLSelectElement>(null)

  const [result, setResult] = useState(items)
  const availableData = prepareAvailable(available || [], result, title)

  const remove = (value: string) => {
    const items = result.filter((item) => item !== value)
    setResult(items)
    onChange(items)
  }

  const addItem = (value: string) => {
    if (value === '') return
    const items = result.concat([value])
    setResult(items)
    onChange(items)
  }

  return (
    <>
      <h3 className="title is-size-6">{title}</h3>
      {loading ? <Loading style={{ marginBottom: '1.5rem' }} /> : <hr />}
      <ul>
        <div className="tags">
          {result.map((item) => (
            <Tag
              id={item}
              name={item}
              onRemove={() => remove(item)}
              key={item}
            />
          ))}
        </div>
        {result.length === 0 && (
          <li style={{ marginBottom: '20px' }}>{noData}</li>
        )}
        {(available ?? []).length > 1 && (
          <li className="widget-list-add select is-small">
            <Select
              options={availableData}
              ref={selectRef}
              onChange={(value) => {
                addItem(value as string)
                if (selectRef.current) {
                  selectRef.current.value = ''
                }
              }}
            />
          </li>
        )}
      </ul>
    </>
  )
}
