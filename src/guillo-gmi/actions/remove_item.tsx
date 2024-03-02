import { Confirm } from '../components/modal'
import { useGuillotinaClient, useTraversal } from '../contexts'
import { useCrudContext } from '../hooks/useCrudContext'
import { useLocation } from '../hooks/useLocation'
import { ItemModel } from '../models'

interface Props {
  item: ItemModel
}

export function RemoveItem(props: Props) {
  const Ctx = useTraversal()
  const { del, loading } = useCrudContext()
  const [, navigate] = useLocation()
  const client = useGuillotinaClient()
  const { item } = props

  async function removeItem() {
    const { isError, errorMessage } = await del()

    if (!isError) {
      navigate({
        path: `/${client.cleanPath(item['parent']['@id'])}/`,
        tab: '',
      })
      Ctx.flash(`Field removed!`, 'success')
    } else {
      Ctx.flash(`Failed to delete item!: ${errorMessage}`, 'danger')
    }

    Ctx.cancelAction()
  }

  return (
    <Confirm
      loading={loading}
      onCancel={() => Ctx.cancelAction()}
      onConfirm={removeItem}
      message={`Are you sure to remove: ${item['@name']}?`}
    />
  )
}
