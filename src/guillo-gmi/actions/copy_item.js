import React from 'react'
import { PathTree } from '../components/modal'
import { useTraversal } from '../contexts'
import { useCrudContext } from '../hooks/useCrudContext'
import { getNewId } from '../lib/utils'

export function CopyItem(props) {
  const Ctx = useTraversal()
  const { post } = useCrudContext()
  const { item } = props

  async function copyItem(path, form) {
    const input = form[1] || {}
    const { isError, errorMessage } = await post(
      {
        destination: path,
        new_id: input.value || getNewId(item['@name']),
      },
      '@duplicate'
    )

    if (!isError) {
      Ctx.flash(`Field copied!`, 'success')
    } else {
      Ctx.flash(`Failed to copy item!: ${errorMessage}`, 'danger')
    }
    Ctx.refresh()
    Ctx.cancelAction()
  }

  return (
    <PathTree
      title="Copy to..."
      defaultPath={`/${item['parent']['@name']}`}
      onConfirm={copyItem}
      onCancel={() => Ctx.cancelAction()}
    >
      <React.Fragment>
        <small style={{ display: 'block', marginTop: 20 }}>
          {`New id for "${item['@name']}" copy`}
        </small>
        <input
          type="text"
          className="input"
          defaultValue={getNewId(item['@name'])}
        />
      </React.Fragment>
    </PathTree>
  )
}
