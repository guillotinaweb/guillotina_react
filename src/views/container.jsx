import React from 'react';


import {RItem} from '../components/item'
import {TabsPanel} from '../components/tabs'
import {ContextToolbar} from '../components/context_toolbar'


const tabs = {
  Items: PanelItems,
  Addons: Panel,
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

export function PanelItems(props) {
  console.info(props)
  const {context} = props.state
  const {setPath} = props
  return (
    <table className="table is-fullwidth is-hoverable">
      {context.items.map(item =>
        <RItem item={item} setPath={setPath} key={item["@uid"]} />
      )}
    </table>
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




