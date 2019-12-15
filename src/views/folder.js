import React from "react";
import { TabsPanel } from "../components/tabs";
import { ContextToolbar } from "../components/context_toolbar";
import { PanelItems } from "../components/panel/items";
import { TraversalContext } from "../contexts";

const tabs = {
  Items: PanelItems,
  Properties: Panel,
  Behaviors: Panel,
  Permissions: Panel
};

const tabsPermissions = {
  Items: "guillotina.ViewContent",
  Properties: "guillotina.ViewContent",
  Behaviors: "guillotina.ModifyContent",
  Permissions: "guillotina.SeePermissions"
};

export function Panel(props) {
  return (
    <div className="container">
      <h2 className="title">{props.title}</h2>
      <p>Not implemented</p>
    </div>
  );
}

export function FolderCtx(props) {
  const ctx = React.useContext(TraversalContext);
  const calculated = ctx.filterTabs(tabs, tabsPermissions);

  return (
    <TabsPanel
      tabs={calculated}
      currentTab="Items"
      rightToolbar={<ContextToolbar {...props} />}
      {...props}
    />
  );
}

const tabsItem = {
  Properties: Panel,
  Behaviors: Panel,
  Permissions: Panel
};

export function ItemCtx(props) {
  return <TabsPanel tabs={tabsItem} currentTab="Properties" {...props} />;
}
