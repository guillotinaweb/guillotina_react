import React from "react";
import { TabsPanel } from "../components/tabs";
import { TraversalContext } from "../contexts";

const tabs = {
  Properties: Panel,
  Behaviors: Panel,
  Permissions: Panel
};

const tabsPermissions = {
  Properties: "guillotina.ViewContent",
  Behaviors: "guillotina.ModifyContent",
  Permissions: "guillotina.SeePermissions"
};

function Panel(props) {
  return (
    <div className="container">
      <h2 className="title">{props.title}</h2>
      <p>Not implemented</p>
    </div>
  );
}

export function ItemCtx(props) {
  const ctx = React.useContext(TraversalContext);
  const calculated = ctx.filterTabs(tabs, tabsPermissions);

  return <TabsPanel tabs={calculated} currentTab="Properties" {...props} />;
}
