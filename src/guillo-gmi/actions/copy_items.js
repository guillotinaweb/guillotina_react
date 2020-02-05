import React from 'react'
import {PathTree} from '../components/modal'
import {useContext} from 'react'
import {TraversalContext} from '../contexts'

const withError = res => res.status >= 300

export function CopyItems(props) {
  const Ctx = useContext(TraversalContext)
  const { items = [] } = props

  async function copyItems(path) {   
    const responses = await Promise.all(items.map(item => {
      return Ctx.client.create(path, {
        '@type': item.type_name,
        id: item['@name'],
        title: item.title
      });
    }))

    Ctx.refresh()
    Ctx.cancelAction()

    if(responses.every(withError)) {
      Ctx.flash(`Oops! Items can't be copied to ${path}`, 'danger')
      return
    }

    if(responses.some(withError)) {
      Ctx.flash(`Some items are not copied correctly!`, 'warning')
      return
    }

    Ctx.flash(`Items copied!`, 'success')
  }

  return (
    <PathTree
      title="Copy to..."
      onConfirm={copyItems}
      onCancel={() => Ctx.cancelAction()}
    />
  )
}
