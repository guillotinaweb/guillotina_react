import React from 'react'
import { TabsPanel } from '../components/tabs'
import { ContextToolbar } from '../components/context_toolbar'
import { PanelItems } from '../components/panel/items'
import { TraversalContext } from '../contexts'
import { PanelProperties } from '../components/panel/properties'
import { PanelPermissions } from '../components/panel/permissions'
import { PanelBehaviors } from '../components/panel/behaviors'
// import { PanelRequester } from "../components/panel/requester";

const tabs = {
  Items: PanelItems,
  Properties: PanelProperties,
  Behaviors: PanelBehaviors,
  Permissions: PanelPermissions,
  // Requester: PanelRequester,
}

const tabsPermissions = {
  Items: 'guillotina.ViewContent',
  Properties: 'guillotina.ViewContent',
  Behaviors: 'guillotina.ModifyContent',
  Permissions: 'guillotina.SeePermissions',
  // Requester: "guillotina.swagger.View"
}

export function FolderCtx(props) {
  const ctx = React.useContext(TraversalContext)
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
