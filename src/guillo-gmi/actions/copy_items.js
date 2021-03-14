import React from 'react'
import { PathTree } from '../components/modal'
import { useTraversal } from '../contexts'
import { getContainerFromPath } from '../lib/client'
import { getNewId } from '../lib/utils'

const withError = (res) => res.status >= 300
export function CopyItems(props) {
  const Ctx = useTraversal()
  const { items = [] } = props

  async function copyItems(path, form) {
    const responses = await Promise.all(
      items.map((item, i) => {
        const input = form[i + 1] || {}
        return Ctx.client.post(`${Ctx.path}${item['@name']}/@duplicate`, {
          destination: path,
          new_id: input.value || getNewId(item.id),
        })
      })
    )

    Ctx.refresh()
    Ctx.cancelAction()

    if (responses.every(withError)) {
      Ctx.flash(`Oops! Items can't be copied to ${path}`, 'danger')
      return
    }

    if (responses.some(withError)) {
      Ctx.flash(`Some items are not copied correctly!`, 'warning')
      return
    }

    Ctx.flash(`Items copied!`, 'success')
  }

  function getDefaultPath() {
    const container = getContainerFromPath(Ctx.path)
    const pathSplit = Ctx.path.split(container)
    if (pathSplit.length > 1) {
      return pathSplit[1]
    }
    return ''
  }

  return (
    <PathTree
      title="Copy to..."
      defaultPath={`/${getDefaultPath()}`}
      onConfirm={copyItems}
      onCancel={() => Ctx.cancelAction()}
    >
      {items.map((item) => (
        <React.Fragment key={item.id}>
          <small style={{ display: 'block', marginTop: 20 }}>
            {`New id for "${item.id}" copy`}
          </small>
          <input
            type="text"
            className="input"
            data-test={`inputCopyIdTest-${item['@name']}`}
            defaultValue={getNewId(item.id)}
          />
        </React.Fragment>
      ))}
      &nbsp;
    </PathTree>
  )
}
