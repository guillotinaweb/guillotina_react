import React from 'react';
import {TabsPanel} from '../components/tabs'
import {ContextToolbar} from '../components/context_toolbar'
import {PanelItems} from '../components/panel/items'
import {PanelAddons} from '../components/panel/addons'

const tabs = {
  Items: PanelItems,
  Addons: PanelAddons,
  Registry: Panel,
  Behaviors: Panel,
  Permissions: Panel,
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
  return (
    <TabsPanel tabs={tabs}
      currentTab="Items"
      rightToolbar={
        <ContextToolbar {...props} />
      }
      {...props}
      />
  )
}

