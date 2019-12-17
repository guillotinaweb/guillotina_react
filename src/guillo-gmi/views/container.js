import React from "react";
import { TabsPanel } from "../components/tabs";
import { ContextToolbar } from "../components/context_toolbar";
import { PanelItems } from "../components/panel/items";
import { PanelAddons } from "../components/panel/addons";
import { TraversalContext } from "../contexts";
import { PanelNotImplemented } from "./base";
import { PanelPermissions} from "../components"
import { PanelBehaviors } from "../components";


const tabs = {
  Items: PanelItems,
  Addons: PanelAddons,
  Registry: PanelNotImplemented,
  Behaviors: PanelBehaviors,
  Permissions: PanelPermissions
};

const tabsPermissions = {
  Items: "guillotina.ViewContent",
  Addons: "guillotina.ManageAddons",
  Registry: "guillotina.ReadConfiguration",
  Behaviors: "guillotina.ModifyContent",
  Permissions: "guillotina.SeePermissions"
};


export function ContainerCtx(props) {
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
