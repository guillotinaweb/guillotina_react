import { TabsPanel } from '../components/tabs'
import { ContextToolbar } from '../components/context_toolbar'
import { PanelItems } from '../components/panel/items'
import { PanelActions } from '../components/panel/actions'
import { useTraversal } from '../contexts'
import { PanelProperties } from '../components/panel/properties'
import { PanelPermissions } from '../components/panel/permissions'
import { PanelBehaviors } from '../components/panel/behaviors'

const tabs = {
  Items: PanelItems,
  Properties: PanelProperties,
  Behaviors: PanelBehaviors,
  Permissions: PanelPermissions,
  Actions: PanelActions,
}

const tabsPermissions = {
  Items: 'guillotina.ViewContent',
  Properties: 'guillotina.ViewContent',
  Behaviors: 'guillotina.ModifyContent',
  Permissions: 'guillotina.SeePermissions',
}

export function FolderCtx(props) {
  const ctx = useTraversal()
  const calculated = ctx.filterTabs(tabs, tabsPermissions)

  return (
    <TabsPanel
      tabs={calculated}
      currentTab="Items"
      rightToolbar={<ContextToolbar {...props} />}
      {...props}
    />
  )
}
