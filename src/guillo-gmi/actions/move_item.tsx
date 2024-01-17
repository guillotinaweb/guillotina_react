import { PathTree } from '../components/modal'
import { useGuillotinaClient, useTraversal } from '../contexts'
import { useCrudContext } from '../hooks/useCrudContext'
import { useLocation } from '../hooks/useLocation'
import { ItemModel } from '../models'

interface Props {
  item: ItemModel
}

export function MoveItem(props: Props) {
  const Ctx = useTraversal()
  const { post } = useCrudContext()
  const [, navigate] = useLocation()
  const client = useGuillotinaClient()
  const { item } = props

  async function moveItem(path) {
    const { isError, errorMessage, result } = await post(
      {
        destination: path,
        new_id: item['@name'],
      },
      '@move'
    )

    if (!isError) {
      navigate({
        path: `/${client.cleanPath(result['@url'])}/`,
        tab: '',
      })
      Ctx.flash(`Field moved!`, 'success')
    } else {
      Ctx.flash(`Failed to move item!: ${errorMessage}`, 'danger')
    }

    Ctx.refresh()
    Ctx.cancelAction()
  }

  return (
    <PathTree
      title="Move to..."
      onConfirm={moveItem}
      onCancel={() => Ctx.cancelAction()}
    />
  )
}
