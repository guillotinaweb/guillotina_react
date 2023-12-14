import React from 'react'
import { Select } from '../input/select'
import { Tag } from '../ui/tag'
import { Loading } from '../ui/loading'

const prepareAvailable = (items, already, title) => {
  const def = { value: '', text: `Add ${title}` }
  if (items.length === 0) return []
  if (items[0] && typeof items[0] === 'string') {
    return [def]
      .concat(items.map((x) => ({ value: x, text: x })))
      .filter((item) => !already.includes(item.value))
  }
  return [def].concat(items).filter((item) => !already.includes(item.value))
}

export function TagsWidget({
  items,
  available,
  title,
  noData,
  onChange,
  loading,
}) {
  const selectRef = React.useRef()

  const [result, setResult] = React.useState(items)
  available = prepareAvailable(available || [], result, title)

  const remove = (value) => {
    const items = result.filter((item) => item !== value)
    setResult(items)
    onChange(items)
  }

  const addItem = (value) => {
    if (value === '') return
    const items = result.concat([value])
    setResult(items)
    onChange(items)
  }

  return (
    <React.Fragment>
      <h3 className="title is-size-6">{title}</h3>
      {loading ? <Loading style={{ marginBottom: '1.5rem' }} /> : <hr />}
      <ul>
        <div className="tags">
          {result.map((item) => (
            <Tag name={item} onRemove={() => remove(item)} key={item} />
          ))}
        </div>
        {result.length === 0 && (
          <li style={{ marginBottom: '20px' }}>{noData}</li>
        )}
        {available.length > 1 && (
          <li className="widget-list-add select is-small">
            <Select
              options={available}
              ref={selectRef}
              onChange={(value) => {
                addItem(value)
                selectRef.current.value = ''
              }}
            />
          </li>
        )}
      </ul>
    </React.Fragment>
  )
}
