import React from 'react'
import {Confirm} from '../components/modal'
import {useContext} from 'react'
import {TraversalContext} from '../contexts'
import {sleep} from '../lib/helpers'
import {useConfig} from '../hooks/useConfig'

// BBB guillotina 5
const getId = (item) => {
  if (item["@id"]) {
    return item["@id"]
  }
  return item["@absolute_url"]
}

export function RemoveItems(props) {
  const Ctx = useContext(TraversalContext)
  const cfg = useConfig()
  const [loading, setLoading] = React.useState(false)
  const { items = [] } = props
  const last = items[items.length - 1]['@name']
  const itemsNames = items
    .map(item => item['@name'])
    .join(', ')
    .replace(`, ${last}`, ` and ${last}`)

  async function removeItems() {
    let errors = []
    setLoading(true)

    const actions = items.map(async item => {
      const res = await Ctx.client.delete(getId(item))
      if (!res.ok) {
        const err = await res.json()
        errors.push(err)
      }
    })
    // this sleep is here, to let elasticsearch, wait for
    // index our operations... (will work 99% of use cases)
    actions.push(sleep(cfg.DelayActions))

    await Promise.all(actions)

    if (errors.length === 0) {
      Ctx.flash(`Items removed!`, 'success')
      Ctx.refresh()
    } else {
      const errorstr = errors.map(err => JSON.stringify(err)).join("\n")
      Ctx.flash(`Something went wrong!! ${errorstr}`, 'danger')
    }
    setLoading(false)
    Ctx.cancelAction()
  }

  return (
    <Confirm
      loading={loading}
      onCancel={() => Ctx.cancelAction()}
      onConfirm={removeItems}
      message={`Are you sure to remove: ${itemsNames}?`}
    />
  )
}
