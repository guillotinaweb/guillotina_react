import { Confirm } from '../components/modal'
import { useTraversal } from '../contexts'
import { sleep } from '../lib/helpers'
import { useConfig } from '../hooks/useConfig'
import { ItemModel } from '../models'
import { useState } from 'react'
import { GuillotinaCommonObject, SearchItem } from '../types/guillotina'

interface Props {
  items: ItemModel<SearchItem | GuillotinaCommonObject>[]
}
export function RemoveItems(props: Props) {
  const Ctx = useTraversal()
  const cfg = useConfig()
  const [loading, setLoading] = useState(false)
  const { items = [] } = props
  const last = items[items.length - 1].id
  const itemsNames = items
    .map((item) => item.id)
    .join(', ')
    .replace(`, ${last}`, ` and ${last}`)

  async function removeItems() {
    const errors: unknown[] = []
    setLoading(true)

    const actions = items.map(async (item) => {
      const res = await Ctx.client.delete(`${Ctx.path}${item.id}`, {})
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
      const errorstr = errors.map((err) => JSON.stringify(err)).join('\n')
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
