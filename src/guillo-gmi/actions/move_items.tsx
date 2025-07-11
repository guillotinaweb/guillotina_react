import { PathTree } from '../components/modal'
import { useTraversal } from '../contexts'
import { ItemModel } from '../models'
import { GuillotinaCommonObject } from '../types/guillotina'
import { SearchItem } from '../types/guillotina'

const withError = (res: Response) => res.status >= 300

interface Props {
  items: ItemModel<SearchItem | GuillotinaCommonObject>[]
}
export function MoveItems(props: Props) {
  const Ctx = useTraversal()
  const { items = [] } = props

  async function moveItems(path: string) {
    const responses = await Promise.all(
      items.map((item) => {
        return Ctx.client.post(`${Ctx.path}${item.id}/@move`, {
          destination: path,
          new_id: item.id,
        })
      })
    )

    Ctx.refresh()
    Ctx.cancelAction()

    if (responses.every(withError)) {
      Ctx.flash(`Oops! Items can't be moved to ${path}`, 'danger')
      return
    }

    if (responses.some(withError)) {
      Ctx.flash(`Some items are not moved correctly!`, 'warning')
      return
    }

    Ctx.flash(`Items moved!`, 'success')
  }

  return (
    <PathTree
      title="Move to..."
      onConfirm={moveItems}
      onCancel={() => Ctx.cancelAction()}
    />
  )
}
