import React from "react";
import { TabsPanel } from "../components/tabs";
import { TraversalContext } from "../contexts";
import { PanelPermissions} from "../components/panel/permissions"
import { PanelBehaviors } from "../components/panel/behaviors";
import { PanelProperties } from "../components/panel/properties";


const tabs = {
  Properties: PanelProperties,
  Behaviors: PanelBehaviors,
  Permissions: PanelPermissions
};

const tabsPermissions = {
  Properties: "guillotina.ViewContent",
  Behaviors: "guillotina.ModifyContent",
  Permissions: "guillotina.SeePermissions"
};



export function ItemCtx(props) {
  const ctx = React.useContext(TraversalContext);
  const calculated = ctx.filterTabs(tabs, tabsPermissions);

  return <TabsPanel tabs={calculated} currentTab="Properties" {...props} />;
}
