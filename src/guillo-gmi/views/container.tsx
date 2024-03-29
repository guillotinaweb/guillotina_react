import { TabsPanel } from '../components/tabs'
import { ContextToolbar } from '../components/context_toolbar'
import { PanelItems } from '../components/panel/items'
import { PanelActions } from '../components/panel/actions'
import { PanelAddons } from '../components/panel/addons'
import { useTraversal } from '../contexts'
import { PanelNotImplemented } from './base'
import { PanelPermissions } from '../components/panel/permissions'
import { PanelBehaviors } from '../components/panel/behaviors'

const tabs = {
  Items: PanelItems,
  Addons: PanelAddons,
  Registry: PanelNotImplemented,
  Behaviors: PanelBehaviors,
  Permissions: PanelPermissions,
  Actions: PanelActions,
}

const tabsPermissions = {
  Items: 'guillotina.ViewContent',
  Addons: 'guillotina.ManageAddons',
  Registry: 'guillotina.ReadConfiguration',
  Behaviors: 'guillotina.ModifyContent',
  Permissions: 'guillotina.SeePermissions',
}

export function ContainerCtx() {
  const ctx = useTraversal()
  const calculated = ctx.filterTabs(tabs, tabsPermissions)
  return (
    <TabsPanel
      tabs={calculated}
      currentTab="Items"
      rightToolbar={<ContextToolbar />}
    />
  )
}
