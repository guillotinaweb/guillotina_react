import { TabsPanel } from '../components/tabs'
import { useTraversal } from '../contexts'
import { PanelPermissions } from '../components/panel/permissions'
import { PanelBehaviors } from '../components/panel/behaviors'
import { PanelProperties } from '../components/panel/properties'
import { PanelActions } from '../components/panel/actions'

const tabs = {
  Properties: PanelProperties,
  Behaviors: PanelBehaviors,
  Permissions: PanelPermissions,
  Actions: PanelActions,
}

const tabsPermissions = {
  Properties: 'guillotina.ViewContent',
  Behaviors: 'guillotina.ModifyContent',
  Permissions: 'guillotina.SeePermissions',
}

export function ItemCtx() {
  const ctx = useTraversal()
  const calculated = ctx.filterTabs(tabs, tabsPermissions)

  return <TabsPanel tabs={calculated} currentTab="Properties" />
}
