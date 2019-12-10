import React from 'react';
import {TabsPanel} from '../components/tabs'
import {PanelItems} from '../components/panel/items'
import { TraversalContext } from '../contexts';
import { AddUserForm } from '../forms/users';
import {formatDate} from '../lib/utils'

const tabs = {
  Users: PanelItems,
}


export function UsersToolbar(props) {

  const Ctx = React.useContext(TraversalContext)

  return (
    <button className="button is-primary"
      onClick={()=>Ctx.doAction('addItem', {type:'User'})}
        aria-haspopup="true" aria-controls="dropdown-menu">
        <span className="icon">
          <i className="fas fa-user"></i>
        </span>
        <span>Add a User</span>
    </button>
  )
}


export function UsersCtx(props) {
  return (
    <TabsPanel tabs={tabs}
      currentTab="Users"
      rightToolbar={
        <UsersToolbar />
      }
      {...props}
      />
  )
}


export function UserCtx(props) {

  const Ctx = React.useContext(TraversalContext)

  return (
    <div className="container">
      <h2 className="title is-size-5 has-text-danger">User</h2>
      <div className="container user-props">
        <p><label>Username: </label> {Ctx.context.username} ({Ctx.context.email})</p>
        <p><label> Created: </label> {formatDate(Ctx.context.creation_date)}</p>
        <p><label> Updated: </label> {formatDate(Ctx.context.modification_date)}</p>
      </div>
      <hr/>
      <div className="columns">
        <div className="column">
          <AddUserForm actionName="Save"
            formData={Ctx.context}
          />
        </div>
        <div className="column">
          <h3>Groups:</h3>
          <hr />

          <h3>Roles:</h3>
          <hr />

          <h3>Permissions</h3>
        </div>

      </div>


    </div>
  )
}
