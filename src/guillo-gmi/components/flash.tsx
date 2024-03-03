import { useTraversal } from '../contexts'
import { Notification } from './ui/notification'
import { Delete } from './ui/delete'

export function Flash() {
  const Ctx = useTraversal()
  const { flash } = Ctx.state

  if (!flash.message) return null

  return (
    <Notification isColor={flash.type}>
      {flash.message}
      <Delete onClick={() => Ctx.clearFlash()} />
    </Notification>
  )
}
