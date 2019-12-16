import React from 'react';
import {TabsPanel} from '../components/tabs'
import {ContextToolbar} from '../components/context_toolbar'
import {PanelItems} from '../components/panel/items'
import {PanelAddons} from '../components/panel/addons'
import {TraversalContext} from '../contexts'
import {PanelDocs} from '../components/panel/docs'

const tabs = {
  Items: PanelItems,
  Addons: PanelAddons,
  Registry: Panel,
  Behaviors: Panel,
  Permissions: Panel,
}

const tabsPermissions = {
  Items: "guillotina.ViewContent",
  Addons: "guillotina.ManageAddons",
  Registry: "guillotina.ReadConfiguration",
  Behaviors: "guillotina.ModifyContent",
  Permissions: "guillotina.SeePermissions",
}


export function Panel(props) {
  return (
    <div className="container">
      <h2 className="title">{props.title}</h2>
      <p>Not implemented</p>
    </div>
  )
}


export function ContainerCtx(props) {

  const ctx = React.useContext(TraversalContext)
  const calculated = ctx.filterTabs(tabs, tabsPermissions)
  return (
    <TabsPanel tabs={calculated}
      currentTab="Items"
      rightToolbar={
        <ContextToolbar {...props} />
      }
      {...props}
      />
  )
}

