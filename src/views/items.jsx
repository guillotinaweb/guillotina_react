import React from 'react';
import {RItem} from '../components/item'
import {TabsPanel} from '../components/tabs'
import {ContextToolbar} from '../components/context_toolbar'
import {TraversalContext} from '../contexts'
import {useContext} from 'react'
import {formatDate} from '../lib/utils'

const tabs = {
  Items: PanelItems,
  Properties: Panel,
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
  const {context} = props.state
  const {setPath} = props

  return (
    <>
      <p className="has-text-right">
        <strong>{context.length} items</strong>&nbsp;
        Modified: {formatDate(context.modification_date)}
      </p>
      <table className="table is-fullwidth is-hoverable">
        <tbody>
        {context.items.map(item =>
          <RItem item={item} setPath={setPath} key={item["@uid"]} />
        )}
        </tbody>
      </table>
    </>
  )
}


export function FolderCtx(props) {
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




