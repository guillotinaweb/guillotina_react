import React from "react";
import { TabsPanel } from "../components/tabs";
import { ContextToolbar } from "../components/context_toolbar";
import { PanelItems } from "../components/panel/items";
import { TraversalContext } from "../contexts";
import { PanelProperties } from "../components/panel/properties";
import { PanelNotImplemented } from "./base";

const tabs = {
  Items: PanelItems,
  Properties: PanelProperties,
  Behaviors: PanelNotImplemented,
  Permissions: PanelNotImplemented
};

const tabsPermissions = {
  Items: "guillotina.ViewContent",
  Properties: "guillotina.ViewContent",
  Behaviors: "guillotina.ModifyContent",
  Permissions: "guillotina.SeePermissions"
};

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

// const tabsItem = {
//   Properties: PanelNotImplemented,
//   Behaviors: PanelNotImplemented,
//   Permissions: PanelNotImplemented
// };

// export function ItemCtx(props) {
//   return <TabsPanel tabs={tabsItem} currentTab="Properties" {...props} />;
// }
